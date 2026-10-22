import { Linking, Pressable, Text, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { Article, EventItem, Video } from './types';
import styles from './styles';
export function FeaturedVideo({ video }: { video?: Video }) {
  const source = video?.videoType === 'UPLOAD' && video.videoUrl ? { uri: video.videoUrl } : null;
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = false;
    instance.muted = true;
  });
  if (!video)
    return (
      <View style={styles.videoPlaceholder}>
        <Text style={styles.playGlyph}>?</Text>
        <Text style={styles.videoPlaceholderText}>SME TV videos will appear here</Text>
      </View>
    );
  if (!source)
    return (
      <Pressable
        accessibilityRole="button"
        style={styles.videoPlaceholder}
        onPress={() => {
          if (video.videoType === 'YOUTUBE' && video.youtubeId)
            void Linking.openURL(`https://www.youtube.com/watch?v=${video.youtubeId}`);
        }}
      >
        <Text style={styles.playGlyph}>▶</Text>
        <Text style={styles.videoPlaceholderText}>
          {video.videoType === 'YOUTUBE' ? 'Open on YouTube' : 'Video unavailable'}
        </Text>
        <Text style={styles.videoTitle}>{video.title}</Text>
      </Pressable>
    );
  return (
    <View>
      <VideoView
        player={player}
        style={styles.videoPlayer}
        nativeControls
        contentFit="cover"
        allowsFullscreen
        allowsPictureInPicture
      />
      <Text style={styles.videoTitle}>{video.title}</Text>
      <Text style={styles.muted}>{video.description}</Text>
    </View>
  );
}

export function Section({ title, onMore }: { title: string; onMore: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onMore}>
        <Text style={styles.more}>See all ?</Text>
      </Pressable>
    </View>
  );
}
export function Retry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.muted}>{message}</Text>
      <Pressable onPress={onRetry}>
        <Text style={styles.more}>Try again</Text>
      </Pressable>
    </View>
  );
}
export function ArticleCard({ article, onPress }: { article: Article; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.article}>
      <Text style={styles.kicker}>{article.category?.name ?? 'SME NEWS'}</Text>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.muted}>{article.summary}</Text>
      <Text style={styles.articleDate}>
        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN') : 'SME TV'}
      </Text>
    </Pressable>
  );
}
export function EventCard({ item, onRegister }: { item: EventItem; onRegister: () => void }) {
  return (
    <View style={styles.event}>
      <Text style={styles.eventDate}>
        {new Date(item.startsAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.muted}>{item.location ?? 'Details to be announced'}</Text>
      <Text style={styles.muted} numberOfLines={3}>
        {item.description}
      </Text>
      <Pressable style={styles.eventButton} onPress={onRegister}>
        <Text style={styles.eventButtonText}>Register interest ?</Text>
      </Pressable>
    </View>
  );
}
