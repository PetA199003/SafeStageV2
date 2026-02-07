import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/api';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';
import { CANTONS } from '../../../constants/cantons';

export default function CantonRegulationsScreen() {
  const { cantonCode } = useLocalSearchParams<{ cantonCode: string }>();
  const canton = CANTONS.find((c) => c.code === cantonCode);

  const { data: categoriesData, isLoading: catLoading } = useQuery({
    queryKey: ['regulationCategories'],
    queryFn: api.getRegulationCategories,
  });

  const { data: regulationsData, isLoading: regLoading } = useQuery({
    queryKey: ['regulations', cantonCode],
    queryFn: () => api.getRegulations(cantonCode!),
    enabled: !!cantonCode,
  });

  const regulations = regulationsData?.data || [];
  const categories = categoriesData || [];

  const getCategoryIcon = (icon: string | null): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'flame': 'flame',
      'log-out': 'log-out',
      'zap': 'flash',
      'users': 'people',
      'arrow-right-circle': 'arrow-forward-circle',
      'hard-hat': 'construct',
      'volume-2': 'volume-high',
      'accessibility': 'accessibility',
    };
    return iconMap[icon || ''] || 'document-text';
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: canton?.name || cantonCode || '' }} />
      <ScreenWrapper>
        <View style={styles.cantonHeader}>
          <View style={styles.cantonBadge}>
            <Text style={styles.cantonCode}>{cantonCode}</Text>
          </View>
          <Text style={styles.cantonName}>{canton?.name || cantonCode}</Text>
        </View>

        {(catLoading || regLoading) ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
        ) : categories.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              Noch keine Vorschriften für diesen Kanton verfügbar.
            </Text>
          </Card>
        ) : (
          categories.map((cat: any) => {
            const catRegs = regulations.filter((r: any) => r.categoryId === cat.id);
            return (
              <Card key={cat.id} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Ionicons name={getCategoryIcon(cat.icon)} size={24} color={Colors.primary} />
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    {cat.description && (
                      <Text style={styles.categoryDesc}>{cat.description}</Text>
                    )}
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{catRegs.length}</Text>
                  </View>
                </View>

                {catRegs.map((reg: any) => (
                  <TouchableOpacity key={reg.id} style={styles.regulationItem}>
                    <Text style={styles.regulationTitle}>{reg.title}</Text>
                    <Text style={styles.regulationSummary} numberOfLines={2}>
                      {reg.summary}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Card>
            );
          })
        )}
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  cantonHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  cantonBadge: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cantonCode: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
  },
  cantonName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  loading: {
    marginTop: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: Spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  categoryName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  categoryDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  regulationItem: {
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  regulationTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  regulationSummary: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
