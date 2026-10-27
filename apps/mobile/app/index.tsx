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
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
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
    setLoadingVideos(false);
    setLoadingEvents(false);
    setError('');
    try {
      const newsResponse = await fetch(`${API}/api/news?limit=30`);
      if (!newsResponse.ok) throw new Error('News is temporarily unavailable.');
      const news = await newsResponse.json();
      setArticles(news.data ?? []);
      setLoading(false);

      setLoadingVideos(true);
      const videoResponse = await fetch(`${API}/api/videos`);
      if (!videoResponse.ok) throw new Error('Videos are temporarily unavailable.');
      const videoData = await videoResponse.json();
      setVideos(videoData.data ?? []);
      setLoadingVideos(false);

      setLoadingEvents(true);
      const eventResponse = await fetch(`${API}/api/events`);
      if (!eventResponse.ok) throw new Error('Events are temporarily unavailable.');
      const eventData = await eventResponse.json();
      setEvents(eventData.data ?? []);
      setLoadingEvents(false);
    } catch {
      setError('Unable to load SME TV. Check your connection and try again.');
      setLoading(false);
      setLoadingVideos(false);
      setLoadingEvents(false);
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
            {articles[0] && (
              <View style={styles.breaking}>
                <Text style={styles.breakingLabel}>LATEST</Text>
                <Text style={styles.breakingText}>{articles[0].title}</Text>
              </View>
            )}
            {articles[0] ? (
              <View style={styles.hero}>
                {articles[0].imageUrl && (
                  <Image
                    source={{ uri: articles[0].imageUrl }}
                    style={[
                      mobileHeroStyles.heroImage,
                      { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
                    ]}
                  />
                )}
                <View style={mobileHeroStyles.heroOverlay} />
                <Text style={mobileHeroStyles.heroLive}>LATEST NEWS</Text>
                {articles[0].category?.name && (
                  <Text style={styles.kicker}>{articles[0].category.name}</Text>
                )}
                <Text style={styles.heroTitle}>{articles[0].title}</Text>
                <Text style={styles.heroSummary}>{articles[0].summary}</Text>
                <Pressable style={styles.pinkButton} onPress={() => void openArticle(articles[0])}>
                  <Text style={styles.pinkButtonText}>Read the story</Text>
                </Pressable>
              </View>
            ) : loading ? (
              <ActivityIndicator color="#d92867" style={{ margin: 25 }} />
            ) : null}
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
            ) : loadingVideos ? (
              <ActivityIndicator color="#d92867" style={{ margin: 25 }} />
            ) : null}
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
            {loadingEvents && <ActivityIndicator color="#d92867" style={{ margin: 25 }} />}
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
