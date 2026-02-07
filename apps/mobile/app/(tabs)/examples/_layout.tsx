import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function ExamplesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Beispiele' }} />
    </Stack>
  );
}
