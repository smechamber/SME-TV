import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import RenderHtml from '@native-html/render';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
type Article = { id: string; title: string; summary: string; content?: string; slug: string; category?: { name?: string }; publishedAt?: string };
type Video = { id: string; title: string; description?: string; videoUrl?: string; youtubeId?: string; thumbnail?: string; videoType: 'UPLOAD' | 'YOUTUBE' };
type EventItem = { id: string; title: string; description: string; startsAt: string; location?: string };
type Tab = 'Home' | 'News' | 'Watch' | 'Events' | 'Profile';
type Registration = { name: string; designation: string; companyName: string; businessActivity: string; specificInterest: string; email: string; mobile: string; city: string; state: string; consent: boolean };
const emptyRegistration: Registration = { name: '', designation: '', companyName: '', businessActivity: '', specificInterest: '', email: '', mobile: '', city: '', state: '', consent: false };

function FeaturedVideo({ video }: { video?: Video }) {
  const source = video?.videoType === 'UPLOAD' && video.videoUrl ? { uri: video.videoUrl } : null;
  const player = useVideoPlayer(source, instance => { instance.loop = false; instance.muted = true; });
  if (!video) return <View style={styles.videoPlaceholder}><Text style={styles.playGlyph}>?</Text><Text style={styles.videoPlaceholderText}>SME TV videos will appear here</Text></View>;
  if (!source) return <Pressable accessibilityRole="button" style={styles.videoPlaceholder} onPress={() => { if (video.videoType === 'YOUTUBE' && video.youtubeId) void Linking.openURL(`https://www.youtube.com/watch?v=${video.youtubeId}`); }}><Text style={styles.playGlyph}>▶</Text><Text style={styles.videoPlaceholderText}>{video.videoType === 'YOUTUBE' ? 'Open on YouTube' : 'Video unavailable'}</Text><Text style={styles.videoTitle}>{video.title}</Text></Pressable>;
  return <View><VideoView player={player} style={styles.videoPlayer} nativeControls contentFit="cover" allowsFullscreen allowsPictureInPicture /><Text style={styles.videoTitle}>{video.title}</Text><Text style={styles.muted}>{video.description}</Text></View>;
}

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
    setLoading(true); setError('');
    try {
      const [newsResponse, videoResponse, eventResponse] = await Promise.all([fetch(`${API}/api/news?limit=30`), fetch(`${API}/api/videos`), fetch(`${API}/api/events`)]);
      if (!newsResponse.ok || !videoResponse.ok || !eventResponse.ok) throw new Error('Some content is temporarily unavailable. Pull to refresh or try again later.');
      const [news, videoData, eventData] = await Promise.all([newsResponse.json(), videoResponse.json(), eventResponse.json()]);
      setArticles(news.data ?? []); setVideos(videoData.data ?? []); setEvents(eventData.data ?? []);
    } catch { setError('Can’t reach SME TV right now. Check your connection and try again.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = articles.filter(article => `${article.title} ${article.summary}`.toLowerCase().includes(search.toLowerCase()));
  const { width: screenWidth } = useWindowDimensions();

  async function openArticle(article: Article) {
    setSelectedArticle(article); setArticleError('');
    try { const response = await fetch(`${API}/api/news/${encodeURIComponent(article.slug)}`); const payload = await response.json(); if (!response.ok) throw new Error(payload.message ?? 'Article is unavailable'); setSelectedArticle(payload.data); }
    catch (e) { setArticleError(e instanceof Error ? e.message : 'Article is unavailable'); }
  }

  async function submitRegistration() {
    if (!selectedEvent) return;
    setSubmitting(true); setFormNotice('');
    try {
      const response = await fetch(`${API}/api/events/${selectedEvent.id}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registration) });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.message ?? 'Unable to submit registration');
      setFormNotice('Your registration is confirmed. Thank you!'); setRegistration(emptyRegistration);
    } catch (e) { setFormNotice(e instanceof Error ? e.message : 'Unable to submit registration'); }
    finally { setSubmitting(false); }
  }

  return <View style={styles.root}>
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}><View><Image source={{ uri: 'https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png' }} style={styles.brandImage} accessibilityLabel="SME TV" /><Text style={styles.tagline}>DIGITAL VOICE OF SMEs</Text></View><Pressable style={styles.searchAction} onPress={() => setTab('News')}><Text style={styles.searchIcon}>Search</Text></Pressable></View>
      {tab === 'Home' && <>
        <View style={styles.breaking}><Text style={styles.breakingLabel}>LATEST</Text><Text style={styles.breakingText}>News and ideas for India’s SME community</Text></View>
        <ImageBackground source={{ uri: articles[0]?.imageUrl ?? 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85' }} imageStyle={mobileHeroStyles.heroImage} style={styles.hero}><View style={mobileHeroStyles.heroOverlay} /><Text style={mobileHeroStyles.heroLive}>●  LATEST NEWS</Text><Text style={styles.kicker}>{articles[0]?.category?.name ?? 'BUSINESS · INDUSTRY · PEOPLE'}</Text><Text style={styles.heroTitle}>{articles[0]?.title ?? 'Stories that move business forward.'}</Text><Text style={styles.heroSummary}>{articles[0]?.summary ?? 'News and conversations for India’s SME community.'}</Text><Pressable style={styles.pinkButton} onPress={() => articles[0] ? void openArticle(articles[0]) : setTab('News')}><Text style={styles.pinkButtonText}>Read the story  →</Text></Pressable></ImageBackground>
        <Section title="Top stories" onMore={() => setTab('News')} />{loading ? <ActivityIndicator color="#d92867" style={{ margin: 25 }} /> : error ? <Retry message={error} onRetry={() => void load()} /> : filtered.slice(0, 5).map(article => <ArticleCard key={article.id} article={article} onPress={() => void openArticle(article)} />)}
        <Section title="Watch SME TV" onMore={() => setTab('Watch')} />{videos[0] ? <View style={styles.card}><FeaturedVideo video={videos[0]} /></View> : <View style={styles.empty}><Text style={styles.emptyTitle}>On screen with SMEs</Text><Text style={styles.muted}>Videos and interviews will appear here.</Text></View>}
        <Section title="Upcoming events" onMore={() => setTab('Events')} />{events.slice(0, 3).map(item => <EventCard key={item.id} item={item} onRegister={() => { setSelectedEvent(item); setFormNotice(''); }} />)}{!events.length && !loading && <View style={styles.empty}><Text style={styles.muted}>No upcoming events at the moment.</Text></View>}
      </>}
      {tab === 'News' && <><Text style={styles.pageTitle}>Latest news</Text><TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Search stories" placeholderTextColor="#928d9a" />{loading ? <ActivityIndicator color="#d92867" style={{ margin: 25 }} /> : error ? <Retry message={error} onRetry={() => void load()} /> : filtered.map(article => <ArticleCard key={article.id} article={article} onPress={() => void openArticle(article)} />)}</>}
      {tab === 'Watch' && <><Text style={styles.pageTitle}>Watch SME TV</Text>{loading ? <ActivityIndicator color="#d92867" style={{ margin: 25 }} /> : error ? <Retry message={error} onRetry={() => void load()} /> : videos.map(video => <View style={styles.card} key={video.id}><FeaturedVideo video={video} /></View>)}</>}
      {tab === 'Events' && <><Text style={styles.pageTitle}>Upcoming events</Text>{loading ? <ActivityIndicator color="#d92867" style={{ margin: 25 }} /> : error ? <Retry message={error} onRetry={() => void load()} /> : events.map(item => <EventCard key={item.id} item={item} onRegister={() => { setSelectedEvent(item); setFormNotice(''); }} />)}</>}
      {tab === 'Profile' && <View style={styles.profile}><Text style={styles.profileIcon}>SME</Text><Text style={styles.pageTitle}>Your SME TV account</Text><Text style={styles.muted}>Sign in or create an account to manage saved stories, event registrations and your preferences.</Text><Text style={styles.muted}>Account sign-in is available through the shared platform API.</Text></View>}
      <View style={styles.footer}><Text style={styles.logo}>SME<Text style={styles.logoPurple}>TV</Text></Text><Text style={styles.muted}>Samruddhi Venture Park · Mumbai</Text><Text style={styles.muted}>director@smechamber.com</Text></View>
    </ScrollView>
    <View style={styles.tabs}>{(['Home', 'News', 'Watch', 'Events', 'Profile'] as Tab[]).map(item => <Pressable key={item} style={styles.tab} onPress={() => setTab(item)}><Text style={[styles.tabIcon, tab === item && styles.tabSelected]}>{item[0]}</Text><Text style={[styles.tabLabel, tab === item && styles.tabSelected]}>{item}</Text></Pressable>)}</View>
    <Modal visible={Boolean(selectedEvent)} animationType="slide" onRequestClose={() => setSelectedEvent(null)}><ScrollView style={styles.modal} contentContainerStyle={styles.modalContent}><Pressable onPress={() => setSelectedEvent(null)}><Text style={styles.close}>Close</Text></Pressable><Text style={styles.kicker}>EVENT REGISTRATION</Text><Text style={styles.pageTitle}>{selectedEvent?.title}</Text><Text style={styles.muted}>Please complete all required fields.</Text>{(['name', 'designation', 'companyName', 'businessActivity', 'specificInterest', 'email', 'mobile', 'city', 'state'] as (keyof Registration)[]).map(key => <TextInput key={key} style={styles.formInput} placeholder={`${key === 'companyName' ? 'Company name' : key === 'businessActivity' ? 'Business activity' : key === 'specificInterest' ? 'Specific interest' : key[0].toUpperCase() + key.slice(1)} *`} placeholderTextColor="#928d9a" value={String(registration[key])} onChangeText={value => setRegistration(prev => ({ ...prev, [key]: value }))} keyboardType={key === 'email' ? 'email-address' : key === 'mobile' ? 'phone-pad' : 'default'} autoCapitalize={key === 'email' ? 'none' : 'sentences'} />)}<Pressable onPress={() => setRegistration(prev => ({ ...prev, consent: !prev.consent }))} style={styles.consent}><Text style={styles.checkbox}>{registration.consent ? '[x]' : '[ ]'}</Text><Text style={styles.muted}>I agree to the privacy notice and consent to being contacted about this event.</Text></Pressable>{formNotice ? <Text style={formNotice.includes('confirmed') ? styles.success : styles.formError}>{formNotice}</Text> : null}<Pressable style={[styles.pinkButton, submitting && { opacity: 0.6 }]} disabled={submitting} onPress={() => void submitRegistration()}><Text style={styles.pinkButtonText}>{submitting ? 'Submitting...' : 'Submit registration'}</Text></Pressable></ScrollView></Modal>
    <Modal visible={Boolean(selectedArticle)} animationType="slide" onRequestClose={() => setSelectedArticle(null)}><ScrollView style={styles.modal} contentContainerStyle={styles.modalContent}><Pressable onPress={() => setSelectedArticle(null)}><Text style={styles.close}>Close</Text></Pressable>{selectedArticle && <><Text style={styles.kicker}>{selectedArticle.category?.name ?? 'SME TV NEWS'}</Text><Text style={styles.pageTitle}>{selectedArticle.title}</Text><Text style={styles.muted}>{selectedArticle.summary}</Text>{articleError ? <Text style={styles.formError}>{articleError}</Text> : selectedArticle.content ? <RenderHtml contentWidth={Math.max(300, screenWidth - 40)} source={{ html: selectedArticle.content }} /> : <ActivityIndicator color="#d92867" style={{ margin: 20 }} />}</>}</ScrollView></Modal>
  </View>;
}

function Section({ title, onMore }: { title: string; onMore: () => void }) { return <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text><Pressable onPress={onMore}><Text style={styles.more}>See all ?</Text></Pressable></View>; }
function Retry({ message, onRetry }: { message: string; onRetry: () => void }) { return <View style={styles.empty}><Text style={styles.muted}>{message}</Text><Pressable onPress={onRetry}><Text style={styles.more}>Try again</Text></Pressable></View>; }
function ArticleCard({ article, onPress }: { article: Article; onPress: () => void }) { return <Pressable accessibilityRole="button" onPress={onPress} style={styles.article}><Text style={styles.kicker}>{article.category?.name ?? 'SME NEWS'}</Text><Text style={styles.articleTitle}>{article.title}</Text><Text style={styles.muted}>{article.summary}</Text><Text style={styles.articleDate}>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN') : 'SME TV'}</Text></Pressable>; }
function EventCard({ item, onRegister }: { item: EventItem; onRegister: () => void }) { return <View style={styles.event}><Text style={styles.eventDate}>{new Date(item.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text><Text style={styles.articleTitle}>{item.title}</Text><Text style={styles.muted}>{item.location ?? 'Details to be announced'}</Text><Text style={styles.muted} numberOfLines={3}>{item.description}</Text><Pressable style={styles.eventButton} onPress={onRegister}><Text style={styles.eventButtonText}>Register interest ?</Text></Pressable></View>; }

const mobileHeroStyles = StyleSheet.create({
  heroImage: { borderRadius: 5 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(25, 18, 32, 0.7)', borderRadius: 5 },
  heroLive: { alignSelf: 'flex-start', color: '#fff', backgroundColor: '#d92867', paddingHorizontal: 8, paddingVertical: 5, fontSize: 9, fontWeight: '800', marginBottom: 10 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' }, scroll: { paddingBottom: 22 }, header: { paddingHorizontal: 21, paddingTop: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brandImage: { width: 128, height: 54, resizeMode: 'contain' }, logo: { color: '#d92867', fontSize: 25, fontWeight: '900', letterSpacing: -1.4 }, logoPurple: { color: '#542c71' }, tagline: { color: '#777283', fontSize: 8, letterSpacing: 1.15, marginTop: 1 }, searchAction: { width: 52, height: 38, borderRadius: 20, backgroundColor: '#f7f3f7', alignItems: 'center', justifyContent: 'center' }, searchIcon: { fontSize: 10, color: '#542c71' }, breaking: { backgroundColor: '#f8f3f6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 11, gap: 9 }, breakingLabel: { color: '#d92867', fontSize: 9, fontWeight: '900', letterSpacing: 1 }, breakingText: { color: '#514a59', fontSize: 11 }, hero: { margin: 16, padding: 23, backgroundColor: '#302039', borderRadius: 5 }, kicker: { color: '#d92867', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 }, heroTitle: { color: '#fff', fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -1, marginTop: 12 }, heroSummary: { color: '#d8d0dc', fontSize: 13, lineHeight: 20, marginTop: 10 }, pinkButton: { alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 4, backgroundColor: '#d92867', marginTop: 16 }, pinkButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' }, sectionHead: { paddingHorizontal: 20, marginTop: 16, marginBottom: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { color: '#211a2e', fontSize: 20, fontWeight: '800', letterSpacing: -0.5 }, more: { color: '#d92867', fontSize: 11, fontWeight: '700' }, article: { marginHorizontal: 16, marginBottom: 10, padding: 17, backgroundColor: '#fffaf8', borderLeftWidth: 2, borderLeftColor: '#e7d8e3' }, articleTitle: { color: '#211a2e', fontSize: 17, lineHeight: 22, fontWeight: '700', marginVertical: 7 }, muted: { color: '#777283', fontSize: 12, lineHeight: 18 }, articleDate: { color: '#958f9e', fontSize: 10, marginTop: 9 }, empty: { marginHorizontal: 16, marginVertical: 7, padding: 17, backgroundColor: '#fffaf8', gap: 9 }, emptyTitle: { color: '#211a2e', fontSize: 14, fontWeight: '700' }, card: { marginHorizontal: 16, marginBottom: 10, padding: 13, backgroundColor: '#fffaf8' }, videoPlaceholder: { height: 190, backgroundColor: '#34233f', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 4 }, playGlyph: { color: '#fff', fontSize: 25, marginBottom: 8 }, videoPlaceholderText: { color: '#f3eaf3', fontSize: 12 }, videoTitle: { color: '#211a2e', fontSize: 15, fontWeight: '700', marginTop: 10 }, videoPlayer: { width: '100%', height: 200, backgroundColor: '#241c2d' }, event: { marginHorizontal: 16, marginBottom: 10, padding: 17, borderWidth: 1, borderColor: '#eeeaf0', borderRadius: 4 }, eventDate: { color: '#d92867', fontSize: 11, fontWeight: '800' }, eventButton: { alignSelf: 'flex-start', paddingVertical: 9, marginTop: 8 }, eventButtonText: { color: '#d92867', fontSize: 12, fontWeight: '700' }, pageTitle: { paddingHorizontal: 20, paddingTop: 23, paddingBottom: 13, color: '#211a2e', fontSize: 27, fontWeight: '800', letterSpacing: -0.7 }, searchInput: { marginHorizontal: 16, marginBottom: 14, borderWidth: 1, borderColor: '#eeeaf0', borderRadius: 4, padding: 12, fontSize: 13 }, profile: { paddingHorizontal: 22, paddingVertical: 25, gap: 9 }, profileIcon: { color: '#d92867', fontSize: 34, fontWeight: '900' }, tabs: { minHeight: 58, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eeeaf0', backgroundColor: '#fff', paddingBottom: 4 }, tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }, tabIcon: { color: '#898493', fontSize: 18 }, tabLabel: { color: '#898493', fontSize: 9, fontWeight: '600' }, tabSelected: { color: '#d92867' }, footer: { marginTop: 24, padding: 20, gap: 4, backgroundColor: '#f7f3f7' }, modal: { flex: 1, backgroundColor: '#fff' }, modalContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 36 }, close: { color: '#d92867', alignSelf: 'flex-end', fontWeight: '700', fontSize: 13 }, formInput: { borderWidth: 1, borderColor: '#e7e2eb', borderRadius: 4, padding: 13, marginTop: 11, fontSize: 13 }, consent: { flexDirection: 'row', gap: 9, marginTop: 17, alignItems: 'center' }, checkbox: { color: '#d92867', fontSize: 19 }, success: { color: '#28744f', marginTop: 13, fontSize: 13 }, formError: { color: '#a33232', marginTop: 13, fontSize: 13 },
});
