import { Pressable, Text } from 'react-native';
import type { Article } from '../types';
import styles from '../styles';

export default function ArticleCard({
  article,
  onPress,
}: {
  article: Article;
  onPress: () => void;
}) {
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
