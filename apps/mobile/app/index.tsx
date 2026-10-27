import { useCallback, useEffect, useState } from 'react';
import { ArticleCard, EventCard, FeaturedVideo, Retry, Section } from './components';
import ArticleDetailModal from './modals/ArticleDetailModal';
import EventRegistrationModal from './modals/EventRegistrationModal';
import {
  emptyRegistration,
  type Article,
  type EventItem,
  type Registration,
  type Tab,
  type Video,
} from './types';
import { mobileHeroStyles } from './styles';
import styles from './styles';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
export default function HomeScreen() {
  const [tab, setTab] = useState<Tab>('Home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleError, setArticleError] = useState('');
  const [registration, setRegistration] = useState(emptyRegistration);
  const [submitting, setSubmitting] = useState(false);
  const [formNotice, setFormNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [newsResponse, videoResponse, eventResponse] = await Promise.all([
        fetch(`${API}/api/news?limit=30`),
        fetch(`${API}/api/videos`),
        fetch(`${API}/api/events`),
      ]);
      if (!newsResponse.ok || !videoResponse.ok || !eventResponse.ok)
        throw new Error(
          'Some content is temporarily unavailable. Pull to refresh or try again later.',
        );
      const [news, videoData, eventData] = await Promise.all([
        newsResponse.json(),
        videoResponse.json(),
        eventResponse.json(),
      ]);
      setArticles(news.data ?? []);
      setVideos(videoData.data ?? []);
      setEvents(eventData.data ?? []);
    } catch {
      setError('Can’t reach SME TV right now. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const filtered = articles.filter((article) =>
    `${article.title} ${article.summary}`.toLowerCase().includes(search.toLowerCase()),
  );
  const { width: screenWidth } = useWindowDimensions();

  async function openArticle(article: Article) {
    setSelectedArticle(article);
    setArticleError('');
    try {
      const response = await fetch(`${API}/api/news/${encodeURIComponent(article.slug)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Article is unavailable');
      setSelectedArticle(payload.data);
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : 'Article is unavailable');
    }
  }

  async function submitRegistration() {
    if (!selectedEvent) return;
    setSubmitting(true);
    setFormNotice('');
    try {
      const response = await fetch(`${API}/api/events/${selectedEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Unable to submit registration');
      setFormNotice('Your registration is confirmed. Thank you!');
      setRegistration(emptyRegistration);
    } catch (e) {
      setFormNotice(e instanceof Error ? e.message : 'Unable to submit registration');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Image
              source={{ uri: 'https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png' }}
              style={styles.brandImage}
              accessibilityLabel="SME TV"
            />
            <Text style={styles.tagline}>DIGITAL VOICE OF SMEs</Text>
          </View>
          <Pressable style={styles.searchAction} onPress={() => setTab('News')}>
            <Text style={styles.searchIcon}>Search</Text>
          </Pressable>
        </View>
        {tab === 'Home' && (
          <>
            <View style={styles.breaking}>
              <Text style={styles.breakingLabel}>LATEST</Text>
              <Text style={styles.breakingText}>News and ideas for India’s SME community</Text>
            </View>
            <ImageBackground
              source={{
                uri:
                  articles[0]?.imageUrl ??
                  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
              }}
              imageStyle={mobileHeroStyles.heroImage}
              style={styles.hero}
            >
              <View style={mobileHeroStyles.heroOverlay} />
              <Text style={mobileHeroStyles.heroLive}>● LATEST NEWS</Text>
              <Text style={styles.kicker}>
                {articles[0]?.category?.name ?? 'BUSINESS · INDUSTRY · PEOPLE'}
              </Text>
              <Text style={styles.heroTitle}>
                {articles[0]?.title ?? 'Stories that move business forward.'}
              </Text>
              <Text style={styles.heroSummary}>
                {articles[0]?.summary ?? 'News and conversations for India’s SME community.'}
              </Text>
              <Pressable
                style={styles.pinkButton}
                onPress={() => (articles[0] ? void openArticle(articles[0]) : setTab('News'))}
              >
                <Text style={styles.pinkButtonText}>Read the story →</Text>
              </Pressable>
            </ImageBackground>
            <Section title="Top stories" onMore={() => setTab('News')} />
            {loading ? (
              <ActivityIndicator color="#d92867" style={{ margin: 25 }} />
            ) : error ? (
              <Retry message={error} onRetry={() => void load()} />
            ) : (
              filtered
                .slice(0, 5)
                .map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onPress={() => void openArticle(article)}
                  />
                ))
            )}
            <Section title="Watch SME TV" onMore={() => setTab('Watch')} />
            {videos[0] ? (
              <View style={styles.card}>
                <FeaturedVideo video={videos[0]} />
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>On screen with SMEs</Text>
                <Text style={styles.muted}>Videos and interviews will appear here.</Text>
              </View>
            )}
            <Section title="Upcoming events" onMore={() => setTab('Events')} />
            {events.slice(0, 3).map((item) => (
              <EventCard
                key={item.id}
                item={item}
                onRegister={() => {
                  setSelectedEvent(item);
                  setFormNotice('');
                }}
              />
            ))}
            {!events.length && !loading && (
              <View style={styles.empty}>
                <Text style={styles.muted}>No upcoming events at the moment.</Text>
              </View>
            )}
          </>
        )}
        {tab === 'News' && (
          <>
            <Text style={styles.pageTitle}>Latest news</Text>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search stories"
              placeholderTextColor="#928d9a"
            />
            {loading ? (
              <ActivityIndicator color="#d92867" style={{ margin: 25 }} />
            ) : error ? (
              <Retry message={error} onRetry={() => void load()} />
            ) : (
              filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPress={() => void openArticle(article)}
                />
              ))
            )}
          </>
        )}
        {tab === 'Watch' && (
          <>
            <Text style={styles.pageTitle}>Watch SME TV</Text>
            {loading ? (
              <ActivityIndicator color="#d92867" style={{ margin: 25 }} />
            ) : error ? (
              <Retry message={error} onRetry={() => void load()} />
            ) : (
              videos.map((video) => (
                <View style={styles.card} key={video.id}>
                  <FeaturedVideo video={video} />
                </View>
              ))
            )}
          </>
        )}
        {tab === 'Events' && (
          <>
            <Text style={styles.pageTitle}>Upcoming events</Text>
            {loading ? (
              <ActivityIndicator color="#d92867" style={{ margin: 25 }} />
            ) : error ? (
              <Retry message={error} onRetry={() => void load()} />
            ) : (
              events.map((item) => (
                <EventCard
                  key={item.id}
                  item={item}
                  onRegister={() => {
                    setSelectedEvent(item);
                    setFormNotice('');
                  }}
                />
              ))
            )}
          </>
        )}
        {tab === 'Profile' && (
          <View style={styles.profile}>
            <Text style={styles.profileIcon}>SME</Text>
            <Text style={styles.pageTitle}>Your SME TV account</Text>
            <Text style={styles.muted}>
              Sign in or create an account to manage saved stories, event registrations and your
              preferences.
            </Text>
            <Text style={styles.muted}>
              Account sign-in is available through the shared platform API.
            </Text>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.logo}>
            SME<Text style={styles.logoPurple}>TV</Text>
          </Text>
          <Text style={styles.muted}>Samruddhi Venture Park · Mumbai</Text>
          <Text style={styles.muted}>director@smechamber.com</Text>
        </View>
      </ScrollView>
      <View style={styles.tabs}>
        {(['Home', 'News', 'Watch', 'Events', 'Profile'] as Tab[]).map((item) => (
          <Pressable key={item} style={styles.tab} onPress={() => setTab(item)}>
            <Text style={[styles.tabIcon, tab === item && styles.tabSelected]}>{item[0]}</Text>
            <Text style={[styles.tabLabel, tab === item && styles.tabSelected]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <EventRegistrationModal
        selectedEvent={selectedEvent}
        registration={registration}
        setRegistration={setRegistration}
        submitting={submitting}
        formNotice={formNotice}
        onClose={() => setSelectedEvent(null)}
        onSubmit={() => void submitRegistration()}
      />
      <ArticleDetailModal
        selectedArticle={selectedArticle}
        articleError={articleError}
        screenWidth={screenWidth}
        onClose={() => setSelectedArticle(null)}
      />
    </View>
  );
}
