import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

const calculators = [
  {
    slug: 'emergency-exits',
    title: 'Notausgänge berechnen',
    description: 'Anzahl und Breite der Notausgänge basierend auf Personenzahl und Fläche.',
    icon: 'log-out' as const,
    color: '#e74c3c',
  },
  {
    slug: 'fire-extinguishers',
    title: 'Feuerlöscher berechnen',
    description: 'Erforderliche Anzahl an Feuerlöschern nach Fläche und Risikokategorie.',
    icon: 'shield' as const,
    color: '#f39c12',
  },
  {
    slug: 'capacity',
    title: 'Kapazität berechnen',
    description: 'Maximale Personenkapazität basierend auf Fläche und Ausgängen.',
    icon: 'people' as const,
    color: '#3498db',
  },
  {
    slug: 'evacuation-routes',
    title: 'Fluchtwege berechnen',
    description: 'Fluchtwegbreiten und Evakuierungszeiten berechnen.',
    icon: 'arrow-forward-circle' as const,
    color: '#27ae60',
  },
];

export default function CalculatorScreen() {
  return (
    <ScreenWrapper>
      <Text style={styles.headerText}>
        Wählen Sie eine Berechnung aus:
      </Text>

      {calculators.map((calc) => (
        <TouchableOpacity
          key={calc.slug}
          style={styles.calcCard}
          onPress={() => router.push(`/(tabs)/calculator/${calc.slug}` as any)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: calc.color + '15' }]}>
            <Ionicons name={calc.icon} size={28} color={calc.color} />
          </View>
          <View style={styles.calcInfo}>
            <Text style={styles.calcTitle}>{calc.title}</Text>
            <Text style={styles.calcDesc}>{calc.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  calcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  calcTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  calcDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
