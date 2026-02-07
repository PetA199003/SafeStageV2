import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function RegulationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Vorschriften' }} />
      <Stack.Screen name="[cantonCode]" options={{ headerTitle: 'Kanton' }} />
      <Stack.Screen name="detail/[regulationId]" options={{ headerTitle: 'Vorschrift' }} />
    </Stack>
  );
}
