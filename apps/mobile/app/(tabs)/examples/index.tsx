import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/api';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  concert: 'musical-notes',
  fair: 'storefront',
  theater: 'film',
  'open-air': 'sunny',
  corporate: 'briefcase',
  sports: 'football',
};

export default function ExamplesScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['examples'],
    queryFn: () => api.getExamples(),
  });

  const examples = data?.data || [];

  return (
    <ScreenWrapper>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
      ) : error ? (
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline" size={48} color={Colors.textLight} />
            <Text style={styles.errorText}>
              Beispiele konnten nicht geladen werden.
            </Text>
            <Text style={styles.errorSubtext}>
              Bitte prüfen Sie Ihre Internetverbindung.
            </Text>
          </View>
        </Card>
      ) : examples.length === 0 ? (
        <Card>
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>Noch keine Beispiele verfügbar.</Text>
          </View>
        </Card>
      ) : (
        examples.map((example: any) => (
          <Card key={example.id}>
            <View style={styles.exampleHeader}>
              <Ionicons
                name={categoryIcons[example.category?.slug] || 'document-text'}
                size={24}
                color={Colors.primary}
              />
              <View style={styles.exampleInfo}>
                <Text style={styles.exampleTitle}>{example.title}</Text>
                {example.eventType && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{example.eventType}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.exampleDesc}>{example.description}</Text>
            {example.capacity && (
              <View style={styles.capacityBadge}>
                <Ionicons name="people" size={14} color={Colors.primary} />
                <Text style={styles.capacityText}>{example.capacity} Personen</Text>
              </View>
            )}
          </Card>
        ))
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: Spacing.xxl,
  },
  errorContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  exampleInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  exampleTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  tag: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  tagText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  exampleDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  capacityText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
