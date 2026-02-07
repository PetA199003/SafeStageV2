import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

export default function EmergencyExitsCalculator() {
  const [personCount, setPersonCount] = useState('');
  const [netArea, setNetArea] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const persons = parseInt(personCount, 10);
    const area = parseFloat(netArea);

    if (!persons || persons <= 0 || !area || area <= 0) {
      Alert.alert('Fehler', 'Bitte geben Sie gültige Werte ein.');
      return;
    }

    // VKF-basierte Berechnung
    const sqmPerPerson = 1;
    const exitWidthPer100 = 0.6; // m pro 100 Personen
    const minExitWidth = 0.9; // m
    const minExits = 2;

    const maxCapacity = Math.floor(area / sqmPerPerson);
    const totalExitWidth = (persons / 100) * exitWidthPer100;
    const requiredExits = Math.max(minExits, Math.ceil(totalExitWidth / minExitWidth));
    const widthPerExit = Math.max(minExitWidth, totalExitWidth / requiredExits);

    setResult({
      requiredExits,
      totalExitWidthM: Math.round(totalExitWidth * 100) / 100,
      widthPerExitM: Math.round(widthPerExit * 100) / 100,
      personsPerSqm: Math.round((persons / area) * 100) / 100,
      maxCapacity,
      isOverCapacity: persons > maxCapacity,
    });
  };

  return (
    <ScreenWrapper>
      <Card>
        <Text style={styles.label}>Anzahl Personen</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={personCount}
            onChangeText={setPersonCount}
            keyboardType="numeric"
            placeholder="z.B. 500"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>Personen</Text>
        </View>

        <Text style={styles.label}>Nettofläche</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={netArea}
            onChangeText={setNetArea}
            keyboardType="decimal-pad"
            placeholder="z.B. 300"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>m²</Text>
        </View>

        <Button label="Berechnen" onPress={calculate} variant="primary" size="lg" />
      </Card>

      {result && (
        <Card style={result.isOverCapacity ? styles.warningCard : styles.resultCard}>
          {result.isOverCapacity && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={20} color={Colors.white} />
              <Text style={styles.warningText}>Kapazität überschritten!</Text>
            </View>
          )}

          <Text style={styles.resultTitle}>Ergebnis</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Erforderliche Notausgänge</Text>
            <Text style={styles.resultValue}>{result.requiredExits}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Gesamte Ausgangsbreite</Text>
            <Text style={styles.resultValue}>{result.totalExitWidthM} m</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Breite pro Ausgang (mind.)</Text>
            <Text style={styles.resultValue}>{result.widthPerExitM} m</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Personendichte</Text>
            <Text style={styles.resultValue}>{result.personsPerSqm} P/m²</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Max. Kapazität (Fläche)</Text>
            <Text style={styles.resultValue}>{result.maxCapacity} Personen</Text>
          </View>

          <View style={styles.formulaBox}>
            <Text style={styles.formulaTitle}>Berechnungsgrundlage</Text>
            <Text style={styles.formulaText}>
              VKF Brandschutzrichtlinie 16-15{'\n'}
              Ausgangsbreite = Personenzahl / 100 × 0.6m{'\n'}
              Mindestens 2 unabhängige Ausgänge
            </Text>
          </View>

          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle" size={16} color={Colors.textSecondary} />
            <Text style={styles.disclaimerText}>
              Diese Berechnung dient nur der Orientierung und ersetzt keine behördliche Prüfung.
            </Text>
          </View>
        </Card>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    width: 70,
  },
  resultCard: {
    borderWidth: 2,
    borderColor: Colors.success + '30',
  },
  warningCard: {
    borderWidth: 2,
    borderColor: Colors.danger + '30',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.danger,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  warningText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.sm,
    marginLeft: Spacing.sm,
  },
  resultTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  resultLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  resultValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  formulaBox: {
    backgroundColor: Colors.primary + '08',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  formulaTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  formulaText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  disclaimerText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
    fontStyle: 'italic',
  },
});
