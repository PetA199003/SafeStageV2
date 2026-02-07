import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

const eventTypes = [
  { key: 'standing', label: 'Stehend', sqm: 1 },
  { key: 'seated', label: 'Sitzend', sqm: 2 },
  { key: 'mixed', label: 'Gemischt', sqm: 1.5 },
];

export default function CapacityCalculator() {
  const [netArea, setNetArea] = useState('');
  const [exitCount, setExitCount] = useState('2');
  const [exitWidth, setExitWidth] = useState('');
  const [eventType, setEventType] = useState<'standing' | 'seated' | 'mixed'>('standing');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const area = parseFloat(netArea);
    const exits = parseInt(exitCount, 10);
    const width = parseFloat(exitWidth);

    if (!area || area <= 0 || !exits || exits <= 0 || !width || width <= 0) {
      Alert.alert('Fehler', 'Bitte geben Sie gültige Werte ein.');
      return;
    }

    const sqmPerPerson = eventTypes.find((e) => e.key === eventType)!.sqm;
    const personsPerMWidth = 166;

    const maxByArea = Math.floor(area / sqmPerPerson);
    const maxByExits = Math.floor(width * personsPerMWidth);

    setResult({
      maxPersonsByArea: maxByArea,
      maxPersonsByExits: maxByExits,
      effectiveMax: Math.min(maxByArea, maxByExits),
      limitingFactor: maxByArea <= maxByExits ? 'Fläche' : 'Ausgänge',
    });
  };

  return (
    <ScreenWrapper>
      <Card>
        <Text style={styles.label}>Nettofläche</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={netArea}
            onChangeText={setNetArea}
            keyboardType="decimal-pad"
            placeholder="z.B. 500"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>m²</Text>
        </View>

        <Text style={styles.label}>Veranstaltungsart</Text>
        <View style={styles.typeRow}>
          {eventTypes.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeButton, eventType === t.key && styles.typeButtonActive]}
              onPress={() => setEventType(t.key as any)}
            >
              <Text style={[styles.typeLabel, eventType === t.key && styles.typeLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Anzahl Ausgänge</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={exitCount}
            onChangeText={setExitCount}
            keyboardType="numeric"
            placeholder="z.B. 3"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>Stück</Text>
        </View>

        <Text style={styles.label}>Gesamte Ausgangsbreite</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={exitWidth}
            onChangeText={setExitWidth}
            keyboardType="decimal-pad"
            placeholder="z.B. 3.6"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>m</Text>
        </View>

        <Button label="Berechnen" onPress={calculate} variant="primary" size="lg" />
      </Card>

      {result && (
        <Card style={styles.resultCard}>
          <View style={styles.bigResult}>
            <Text style={styles.bigNumber}>{result.effectiveMax}</Text>
            <Text style={styles.bigLabel}>Maximale Personenanzahl</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Max. nach Fläche</Text>
            <Text style={styles.resultValue}>{result.maxPersonsByArea}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Max. nach Ausgängen</Text>
            <Text style={styles.resultValue}>{result.maxPersonsByExits}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Limitierender Faktor</Text>
            <Text style={[styles.resultValue, { color: Colors.accent }]}>{result.limitingFactor}</Text>
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
  typeRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  typeLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeLabelActive: {
    color: Colors.primary,
  },
  resultCard: {
    borderWidth: 2,
    borderColor: Colors.success + '30',
  },
  bigResult: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
  },
  bigLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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
  },
  resultValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primary,
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
