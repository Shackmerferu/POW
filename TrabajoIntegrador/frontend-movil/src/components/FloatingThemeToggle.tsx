import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppColorScheme } from '@/contexts/ColorSchemeContext';

export default function FloatingThemeToggle() {
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useAppColorScheme();
  const nextThemeLabel = colorScheme === 'light' ? 'oscuro' : 'claro';

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Activar modo ${nextThemeLabel}`}
        accessibilityHint="Alterna entre el tema claro y el tema oscuro de la aplicación"
        onPress={toggleColorScheme}
        style={({ pressed }) => [
          styles.button,
          {
            top: Math.max(insets.top, Platform.OS === 'web' ? 8 : 12) + 8,
            left: Math.max(insets.left, 8) + 8,
            backgroundColor: colorScheme === 'light' ? '#003366' : '#f2b84b',
            borderColor: colorScheme === 'light' ? '#ffffff' : '#18324d',
            opacity: pressed ? 0.84 : 1,
          },
        ]}>
        <Text style={[styles.icon, { color: colorScheme === 'light' ? '#ffffff' : '#18324d' }]}>
          {colorScheme === 'light' ? '☾' : '☀'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#001a33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0, 26, 51, 0.3)' } }),
  },
  icon: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '700',
  },
});
