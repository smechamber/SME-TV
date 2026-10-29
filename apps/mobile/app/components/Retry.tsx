import { Pressable, Text, View } from 'react-native';
import styles from '../styles';

export default function Retry({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.muted}>{message}</Text>
      <Pressable onPress={onRetry}>
        <Text style={styles.more}>Try again</Text>
      </Pressable>
    </View>
  );
}
