import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function CalculatorLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Rechner' }} />
      <Stack.Screen name="emergency-exits" options={{ headerTitle: 'Notausgänge' }} />
      <Stack.Screen name="fire-extinguishers" options={{ headerTitle: 'Feuerlöscher' }} />
      <Stack.Screen name="capacity" options={{ headerTitle: 'Kapazität' }} />
      <Stack.Screen name="evacuation-routes" options={{ headerTitle: 'Fluchtwege' }} />
    </Stack>
  );
}
