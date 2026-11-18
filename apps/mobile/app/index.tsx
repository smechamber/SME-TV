import { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, Text, View } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL ??
  (Platform.OS === 'web' && process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://smetv.in');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => {
    setFailed(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  const handleNavigation = useCallback((navigation: WebViewNavigation) => {
    try {
      const currentHost = new URL(WEB_URL).host;
      const target = new URL(navigation.url);
      if (target.host !== currentHost && !['about:blank', 'blob:'].includes(target.protocol)) {
        void Linking.openURL(navigation.url);
        return false;
      }
    } catch {
      return true;
    }
    return true;
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {failed ? (
          <ErrorScreen onRetry={retry} />
        ) : (
          <>
            <iframe
              key={reloadKey}
              title="SME TV"
              src={WEB_URL}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
              style={{ border: 0, display: 'block', width: '100%', height: '100vh' }}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {loading && <LoadingScreen />}
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {failed ? (
        <ErrorScreen onRetry={retry} />
      ) : (
        <>
          <WebView
            key={reloadKey}
            source={{ uri: WEB_URL }}
            originWhitelist={['http://*', 'https://*']}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            allowsBackForwardNavigationGestures
            mediaPlaybackRequiresUserAction={false}
            onLoadStart={() => {
              setLoading(true);
              setFailed(false);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
            onHttpError={(event) => {
              if (event.nativeEvent.statusCode >= 500) setFailed(true);
            }}
            onShouldStartLoadWithRequest={handleNavigation}
            style={{ flex: 1, backgroundColor: '#fff' }}
          />
          {loading && <LoadingScreen />}
        </>
      )}
    </View>
  );
}

function LoadingScreen() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <ActivityIndicator color="#d92867" size="large" />
      <Text style={{ marginTop: 12, color: '#6e6b7c', fontSize: 13 }}>Loading SME TV…</Text>
    </View>
  );
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ color: '#1e1b4b', fontSize: 23, fontWeight: '800', textAlign: 'center' }}>
        SME TV is unavailable
      </Text>
      <Text
        style={{
          marginTop: 10,
          color: '#6e6b7c',
          fontSize: 14,
          lineHeight: 21,
          textAlign: 'center',
        }}
      >
        Check your internet connection and try again.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={{ marginTop: 20, borderRadius: 6, backgroundColor: '#d92867', paddingHorizontal: 20, paddingVertical: 12 }}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Try again</Text>
      </Pressable>
    </View>
  );
}
