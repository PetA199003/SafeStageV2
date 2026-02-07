import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '../../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const bgColor =
    variant === 'primary' ? Colors.primary :
    variant === 'secondary' ? Colors.primaryLight :
    variant === 'danger' ? Colors.danger :
    'transparent';

  const textColor =
    variant === 'outline' ? Colors.primary : Colors.white;

  const paddingV = size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.lg : Spacing.md;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor, paddingVertical: paddingV },
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize: size === 'sm' ? FontSize.sm : FontSize.md }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  label: {
    fontWeight: '600',
  },
  outline: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
