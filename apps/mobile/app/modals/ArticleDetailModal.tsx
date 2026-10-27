import RenderHtml from '@native-html/render';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text } from 'react-native';
import type { Article } from '../types';
import styles from '../styles';

type Props = {
  selectedArticle: Article | null;
  articleError: string;
  screenWidth: number;
  onClose: () => void;
};

export default function ArticleDetailModal(props: Props) {
  const { selectedArticle, articleError, screenWidth, onClose } = props;
  return (
    <Modal
      visible={Boolean(selectedArticle)}
      animationType="slide"
      onRequestClose={() => onClose()}
    >
      <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent}>
        <Pressable onPress={() => onClose()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        {selectedArticle && (
          <>
            <Text style={styles.kicker}>{selectedArticle.category?.name ?? 'SME TV NEWS'}</Text>
            <Text style={styles.pageTitle}>{selectedArticle.title}</Text>
            <Text style={styles.muted}>{selectedArticle.summary}</Text>
            {articleError ? (
              <Text style={styles.formError}>{articleError}</Text>
            ) : selectedArticle.content ? (
              <RenderHtml
                contentWidth={Math.max(300, screenWidth - 40)}
                source={{ html: selectedArticle.content }}
              />
            ) : (
              <ActivityIndicator color="#d92867" style={{ margin: 20 }} />
            )}
          </>
        )}
      </ScrollView>
    </Modal>
  );
}
