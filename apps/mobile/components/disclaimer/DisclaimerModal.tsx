import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../ui/Button';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface DisclaimerModalProps {
  visible: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ visible, onAccept }: DisclaimerModalProps) {
  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={64} color={Colors.accent} />
          </View>

          <Text style={styles.title}>Safe Stage</Text>
          <Text style={styles.subtitle}>Leitfaden Veranstaltungstechnik Schweiz</Text>

          <View style={styles.disclaimerBox}>
            <View style={styles.disclaimerHeader}>
              <Ionicons name="warning" size={24} color={Colors.warning} />
              <Text style={styles.disclaimerTitle}>Wichtiger Hinweis</Text>
            </View>

            <Text style={styles.disclaimerText}>
              Die Informationen in dieser App dienen ausschliesslich der allgemeinen
              Orientierung und stellen keine rechtsverbindliche Beratung dar.
            </Text>

            <Text style={styles.disclaimerText}>
              Alle Angaben sind ohne Gewähr. Die Inhalte ersetzen in keinem Fall eine
              offizielle Prüfung und Genehmigung durch die zuständige kantonale Behörde.
            </Text>

            <Text style={styles.disclaimerText}>
              Für verbindliche Auskünfte wenden Sie sich bitte an die zuständige
              Feuerpolizei, das Bauinspektorat oder die kantonale Gebäudeversicherung
              Ihres Kantons.
            </Text>

            <Text style={styles.disclaimerEmphasis}>
              Die Nutzung dieser App erfolgt auf eigene Verantwortung.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              label="Verstanden und akzeptiert"
              onPress={onAccept}
              variant="primary"
              size="lg"
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  disclaimerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.warning,
    marginLeft: Spacing.sm,
  },
  disclaimerText: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  disclaimerEmphasis: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.md,
  },
});
