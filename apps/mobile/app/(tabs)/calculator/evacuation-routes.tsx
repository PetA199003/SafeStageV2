import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

export default function EvacuationRoutesCalculator() {
  const [personCount, setPersonCount] = useState('');
  const [floors, setFloors] = useState('1');
  const [distance, setDistance] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const persons = parseInt(personCount, 10);
    const floorCount = parseInt(floors, 10);
    const dist = parseFloat(distance);

    if (!persons || persons <= 0 || !floorCount || floorCount <= 0 || !dist || dist <= 0) {
      Alert.alert('Fehler', 'Bitte geben Sie gültige Werte ein.');
      return;
    }

    const maxDistance = 35; // m
    const minRouteWidth = 1.2; // m
    const routeWidthPer100 = 0.6; // m
    const maxEvacTime = 180; // Sekunden

    const requiredWidth = Math.max(minRouteWidth, (persons / 100) * routeWidthPer100);
    const estimatedTime = (dist / 1.2) + (floorCount > 1 ? (floorCount - 1) * 30 : 0) + (persons / 60);
    const signsRequired = Math.max(1, Math.ceil(dist / 15));
    const isCompliant = dist <= maxDistance && estimatedTime <= maxEvacTime;

    setResult({
      requiredRouteWidthM: Math.round(requiredWidth * 100) / 100,
      maxEvacuationTimeSec: maxEvacTime,
      estimatedEvacuationTimeSec: Math.round(estimatedTime),
      isCompliant,
      illuminatedSignsRequired: signsRequired,
      distanceCompliant: dist <= maxDistance,
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
            placeholder="z.B. 300"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>Personen</Text>
        </View>

        <Text style={styles.label}>Anzahl Stockwerke</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={floors}
            onChangeText={setFloors}
            keyboardType="numeric"
            placeholder="z.B. 2"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>Stockwerke</Text>
        </View>

        <Text style={styles.label}>Distanz zum nächsten Ausgang</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
            keyboardType="decimal-pad"
            placeholder="z.B. 25"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>m</Text>
        </View>

        <Button label="Berechnen" onPress={calculate} variant="primary" size="lg" />
      </Card>

      {result && (
        <Card style={result.isCompliant ? styles.successCard : styles.warningCard}>
          <View style={[styles.statusBanner, { backgroundColor: result.isCompliant ? Colors.success : Colors.danger }]}>
            <Ionicons
              name={result.isCompliant ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={Colors.white}
            />
            <Text style={styles.statusText}>
              {result.isCompliant ? 'Konform' : 'Nicht konform'}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Erforderliche Fluchtwegbreite</Text>
            <Text style={styles.resultValue}>{result.requiredRouteWidthM} m</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Geschätzte Evakuierungszeit</Text>
            <Text style={[styles.resultValue, {
              color: result.estimatedEvacuationTimeSec > result.maxEvacuationTimeSec ? Colors.danger : Colors.primary,
            }]}>
              {result.estimatedEvacuationTimeSec} Sek.
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Max. Evakuierungszeit</Text>
            <Text style={styles.resultValue}>{result.maxEvacuationTimeSec} Sek.</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Fluchtweg-Distanz</Text>
            <Text style={[styles.resultValue, {
              color: result.distanceCompliant ? Colors.success : Colors.danger,
            }]}>
              {result.distanceCompliant ? 'OK' : 'Zu weit'} (max. 35m)
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Beleuchtete Rettungszeichen</Text>
            <Text style={styles.resultValue}>{result.illuminatedSignsRequired} Stück</Text>
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
  successCard: {
    borderWidth: 2,
    borderColor: Colors.success + '30',
  },
  warningCard: {
    borderWidth: 2,
    borderColor: Colors.danger + '30',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  statusText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.lg,
    marginLeft: Spacing.sm,
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
