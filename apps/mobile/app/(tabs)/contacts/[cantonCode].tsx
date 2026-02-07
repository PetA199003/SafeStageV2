import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/api';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';
import { CANTONS } from '../../../constants/cantons';

export default function CantonContactsScreen() {
  const { cantonCode } = useLocalSearchParams<{ cantonCode: string }>();
  const canton = CANTONS.find((c) => c.code === cantonCode);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts', cantonCode],
    queryFn: () => api.getContacts(cantonCode!),
    enabled: !!cantonCode,
  });

  const { data: federalContacts } = useQuery({
    queryKey: ['federalContacts'],
    queryFn: api.getFederalContacts,
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const renderContact = (contact: any) => (
    <Card key={contact.id} style={styles.contactCard}>
      <Text style={styles.contactName}>{contact.name}</Text>
      {contact.department && (
        <Text style={styles.contactDept}>{contact.department}</Text>
      )}

      {contact.street && (
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            {contact.street}, {contact.postalCode} {contact.city}
          </Text>
        </View>
      )}

      <View style={styles.actionRow}>
        {contact.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(contact.phone)}
          >
            <Ionicons name="call" size={18} color={Colors.white} />
            <Text style={styles.actionText}>Anrufen</Text>
          </TouchableOpacity>
        )}

        {contact.email && (
          <TouchableOpacity
            style={[styles.actionButton, styles.emailButton]}
            onPress={() => handleEmail(contact.email)}
          >
            <Ionicons name="mail" size={18} color={Colors.white} />
            <Text style={styles.actionText}>E-Mail</Text>
          </TouchableOpacity>
        )}

        {contact.website && (
          <TouchableOpacity
            style={[styles.actionButton, styles.webButton]}
            onPress={() => handleWebsite(contact.website)}
          >
            <Ionicons name="globe" size={18} color={Colors.white} />
            <Text style={styles.actionText}>Web</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  return (
    <>
      <Stack.Screen options={{ headerTitle: canton?.name || cantonCode || '' }} />
      <ScreenWrapper>
        <View style={styles.header}>
          <View style={styles.cantonBadge}>
            <Text style={styles.cantonCode}>{cantonCode}</Text>
          </View>
          <Text style={styles.headerTitle}>{canton?.name}</Text>
          <Text style={styles.headerSubtitle}>Zuständige Behörden</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
        ) : (
          <>
            {contacts && contacts.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Kantonale Behörden</Text>
                {contacts.map(renderContact)}
              </>
            ) : (
              <Card>
                <Text style={styles.emptyText}>
                  Noch keine Kontakte für diesen Kanton verfügbar.
                </Text>
              </Card>
            )}

            {federalContacts && federalContacts.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Bundesweite Kontakte</Text>
                {federalContacts.map(renderContact)}
              </>
            )}
          </>
        )}
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  cantonBadge: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cantonCode: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  loading: {
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  contactCard: {
    marginBottom: Spacing.md,
  },
  contactName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  contactDept: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  emailButton: {
    backgroundColor: Colors.primary,
  },
  webButton: {
    backgroundColor: Colors.primaryLight,
  },
  actionText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.lg,
  },
});
