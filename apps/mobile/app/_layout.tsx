import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import { DisclaimerModal } from '../components/disclaimer/DisclaimerModal';
import { useDisclaimerStore } from '../store/useDisclaimerStore';
import { Colors } from '../constants/theme';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { accepted, loaded: disclaimerLoaded, accept, loadStatus } = useDisclaimerStore();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    if (loaded && disclaimerLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, disclaimerLoaded]);

  if (!loaded || !disclaimerLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <DisclaimerModal visible={!accepted} onAccept={accept} />
      {accepted && (
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      )}
    </QueryClientProvider>
  );
}
