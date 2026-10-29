import { Linking, Pressable, Text, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { Video } from '../types';
import styles from '../styles';

export default function FeaturedVideo({ video }: { video?: Video }) {
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
