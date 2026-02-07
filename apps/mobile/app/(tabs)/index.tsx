import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Card } from '../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

const quickActions = [
  {
    title: 'Vorschriften',
    subtitle: 'Kantonale Regelungen nachschlagen',
    icon: 'document-text' as const,
    color: '#3498db',
    route: '/(tabs)/regulations' as const,
  },
  {
    title: 'Rechner',
    subtitle: 'Notausgänge, Kapazität berechnen',
    icon: 'calculator' as const,
    color: '#27ae60',
    route: '/(tabs)/calculator' as const,
  },
  {
    title: 'Beispiele',
    subtitle: 'Praxisbeispiele ansehen',
    icon: 'book' as const,
    color: '#8e44ad',
    route: '/(tabs)/examples' as const,
  },
  {
    title: 'Kontakte',
    subtitle: 'Behörden & Ansprechpartner',
    icon: 'call' as const,
    color: '#e67e22',
    route: '/(tabs)/contacts' as const,
  },
];

export default function HomeScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={48} color={Colors.accent} />
        <Text style={styles.title}>Willkommen bei Safe Stage</Text>
        <Text style={styles.subtitle}>
          Ihr Leitfaden für Veranstaltungstechnik in der Schweiz
        </Text>
      </View>

      <View style={styles.grid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.route}
            style={styles.gridItem}
            onPress={() => router.push(action.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={20} color={Colors.accent} />
          <Text style={styles.infoText}>
            Alle Angaben dienen der Orientierung und ersetzen keine behördliche Prüfung.
          </Text>
        </View>
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  gridItem: {
    width: '48%',
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
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: Colors.accent + '08',
    borderWidth: 1,
    borderColor: Colors.accent + '20',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
});
