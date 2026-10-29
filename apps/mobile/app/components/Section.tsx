import { Pressable, Text, View } from 'react-native';
import styles from '../styles';

export default function Section({ title, onMore }: { title: string; onMore: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onMore}>
        <Text style={styles.more}>See all ?</Text>
      </Pressable>
    </View>
  );
}
