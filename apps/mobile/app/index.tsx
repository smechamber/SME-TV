import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return <View style={styles.container}><Text style={styles.brand}>SME-TV</Text><Text style={styles.title}>Voice of SMEs</Text><View style={styles.rule} /><Text style={styles.success}>✓ Expo App Running</Text><Text style={styles.detail}>Phase 1 Setup Successful</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fffaf5', padding: 24 },
  brand: { color: '#e83e8c', fontSize: 16, fontWeight: '700', letterSpacing: 4, textTransform: 'uppercase' },
  title: { color: '#17213a', fontSize: 38, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  rule: { backgroundColor: '#1677c8', borderRadius: 4, height: 4, marginVertical: 28, width: 64 },
  success: { color: '#1677c8', fontSize: 18, fontWeight: '700' },
  detail: { color: '#64748b', fontSize: 15, marginTop: 8 },
});
