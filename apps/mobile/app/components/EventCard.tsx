import { Pressable, Text, View } from 'react-native';
import type { EventItem } from '../types';
import styles from '../styles';

export default function EventCard({
  item,
  onRegister,
}: {
  item: EventItem;
  onRegister: () => void;
}) {
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
