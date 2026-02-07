import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { api } from '../../../../services/api';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../../constants/theme';

export default function RegulationDetailScreen() {
  const { regulationId } = useLocalSearchParams<{ regulationId: string }>();
  const id = Number(regulationId);

  const { data: regulation, isLoading, error } = useQuery({
    queryKey: ['regulation', id],
    queryFn: () => api.getRegulation(id),
    enabled: !isNaN(id),
  });

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: 'Vorschrift' }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Wird geladen...</Text>
        </View>
      </>
    );
  }

  if (error || !regulation) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: 'Fehler' }} />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.accent} />
          <Text style={styles.errorText}>Vorschrift konnte nicht geladen werden.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: regulation.category?.name || 'Vorschrift' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Kategorie-Badge */}
        {regulation.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{regulation.category.name}</Text>
          </View>
        )}

        {/* Titel */}
        <Text style={styles.title}>{regulation.title}</Text>

        {/* Zusammenfassung */}
        <View style={styles.summaryBox}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.summaryText}>{regulation.summary}</Text>
        </View>

        {/* Markdown-Inhalt */}
        <View style={styles.markdownContainer}>
          <Markdown style={markdownStyles as any}>
            {regulation.content || 'Kein Inhalt verfügbar.'}
          </Markdown>
        </View>

        {/* Rechtsgrundlage */}
        {regulation.legalReference && (
          <View style={styles.legalBox}>
            <View style={styles.legalHeader}>
              <Ionicons name="book-outline" size={18} color={Colors.primary} />
              <Text style={styles.legalTitle}>Rechtsgrundlage</Text>
            </View>
            <Text style={styles.legalText}>{regulation.legalReference}</Text>
          </View>
        )}

        {/* Quellenlink */}
        {regulation.sourceUrl && (
          <TouchableOpacity
            style={styles.sourceButton}
            onPress={() => Linking.openURL(regulation.sourceUrl)}
          >
            <Ionicons name="open-outline" size={18} color={Colors.white} />
            <Text style={styles.sourceButtonText}>Offizielle Quelle öffnen</Text>
          </TouchableOpacity>
        )}

        {/* Version & Stand */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Version {regulation.version || 1}</Text>
          {regulation.effectiveDate && (
            <Text style={styles.metaText}>
              Gültig ab: {new Date(regulation.effectiveDate).toLocaleDateString('de-CH')}
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl + 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.accent,
    textAlign: 'center',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  categoryBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 28,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '08',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  summaryText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  markdownContainer: {
    marginBottom: Spacing.lg,
  },
  legalBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  legalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  legalTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  legalText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sourceButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});

const markdownStyles = {
  body: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 8,
  },
  heading2: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    marginTop: 4,
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 4,
  },
  listUnorderedItemIcon: {
    color: Colors.primary,
    fontSize: 8,
    lineHeight: 24,
    marginRight: 8,
  },
  listOrderedItemIcon: {
    color: Colors.primary,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 6,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: Colors.primary + '10',
  },
  th: {
    padding: 8,
    fontWeight: '700' as const,
    fontSize: 13,
    color: Colors.primary,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  td: {
    padding: 8,
    fontSize: 13,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  strong: {
    fontWeight: '700' as const,
    color: Colors.text,
  },
  em: {
    fontStyle: 'italic' as const,
  },
  blockquote: {
    backgroundColor: Colors.primary + '08',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: Colors.primary + '10',
    color: Colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 13,
  },
  hr: {
    backgroundColor: Colors.borderLight,
    height: 1,
    marginVertical: 16,
  },
};
