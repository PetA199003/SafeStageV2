import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

const riskCategories = [
  { key: 'low', label: 'Gering', description: 'Büro, Schule, Hotel', coverage: 300 },
  { key: 'medium', label: 'Mittel', description: 'Verkauf, Werkstatt, Gastronomie', coverage: 200 },
  { key: 'high', label: 'Hoch', description: 'Lager, Produktion, Chemie', coverage: 100 },
];

export default function FireExtinguishersCalculator() {
  const [area, setArea] = useState('');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const areaSqm = parseFloat(area);
    if (!areaSqm || areaSqm <= 0) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige Fläche ein.');
      return;
    }

    const category = riskCategories.find((c) => c.key === risk)!;
    const required = Math.max(1, Math.ceil(areaSqm / category.coverage));

    setResult({
      requiredExtinguishers: required,
      extinguisherType: risk === 'high' ? 'ABC 12kg' : 'ABC 6kg',
      coveragePerUnit: category.coverage,
      riskLabel: category.label,
    });
  };

  return (
    <ScreenWrapper>
      <Card>
        <Text style={styles.label}>Fläche</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            keyboardType="decimal-pad"
            placeholder="z.B. 500"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.unit}>m²</Text>
        </View>

        <Text style={styles.label}>Gefährdungskategorie</Text>
        <View style={styles.riskContainer}>
          {riskCategories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.riskOption, risk === cat.key && styles.riskOptionActive]}
              onPress={() => setRisk(cat.key as any)}
            >
              <Text style={[styles.riskLabel, risk === cat.key && styles.riskLabelActive]}>
                {cat.label}
              </Text>
              <Text style={[styles.riskDesc, risk === cat.key && styles.riskDescActive]}>
                {cat.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Berechnen" onPress={calculate} variant="primary" size="lg" />
      </Card>

      {result && (
        <Card style={styles.resultCard}>
          <Text style={styles.resultTitle}>Ergebnis</Text>

          <View style={styles.bigResult}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.success} />
            <Text style={styles.bigNumber}>{result.requiredExtinguishers}</Text>
            <Text style={styles.bigLabel}>Feuerlöscher erforderlich</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Typ</Text>
            <Text style={styles.resultValue}>{result.extinguisherType}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Abdeckung pro Gerät</Text>
            <Text style={styles.resultValue}>{result.coveragePerUnit} m²</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Gefährdung</Text>
            <Text style={styles.resultValue}>{result.riskLabel}</Text>
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
  riskContainer: {
    marginBottom: Spacing.lg,
  },
  riskOption: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  riskOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  riskLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  riskLabelActive: {
    color: Colors.primary,
  },
  riskDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  riskDescActive: {
    color: Colors.primary,
  },
  resultCard: {
    borderWidth: 2,
    borderColor: Colors.success + '30',
  },
  resultTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
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
    marginTop: Spacing.sm,
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
