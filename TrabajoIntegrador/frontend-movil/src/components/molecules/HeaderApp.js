import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppColorScheme } from '../../contexts/ColorSchemeContext';
import { useFontScale } from '../../contexts/FontScaleContext';
import { escalarEstilos } from '../../utils/escalaTexto';

/**
 * @param {{
 *   alCerrarSesion?: () => void,
 *   alAbrirNotificaciones?: () => void,
 *   alVolver?: () => void,
 * }} props
 */
export default function HeaderApp({ alCerrarSesion, alAbrirNotificaciones, alVolver }) {
  const { colors } = useAppColorScheme();
  const { escala } = useFontScale();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, escala);

  const confirmarCierreSesion = () => {
    Alert.alert('Cerrar sesión', '¿Querés cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: alCerrarSesion },
    ]);
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.backgroundElement,
          borderBottomColor: colors.border,
          paddingTop: Math.max(insets.top, 8),
          minHeight: 50 + Math.max(insets.top, 8),
        },
      ]}
    >
      <View style={styles.sideSlot}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={confirmarCierreSesion}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Text style={[styles.sideIcon, { color: colors.negative }]}>✕</Text>
          <Text style={[styles.sideLabel, { color: colors.negative }]}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Sistema Convenios
      </Text>

      <View style={[styles.sideSlot, styles.rightSlot]}>
        {alVolver ? (
          <TouchableOpacity
            style={[styles.sideButton, styles.rightButton]}
            onPress={alVolver}
            accessibilityRole="button"
            accessibilityLabel="Volver a convenios"
          >
            <Text style={[styles.backIcon, { color: colors.accent }]}>‹</Text>
            <Text style={[styles.sideLabel, { color: colors.accent }]}>Volver</Text>
          </TouchableOpacity>
        ) : alAbrirNotificaciones ? (
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.accent }]}
            onPress={alAbrirNotificaciones}
            accessibilityRole="button"
            accessibilityLabel="Abrir notificaciones"
          >
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      header: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      sideSlot: { width: 72, flexShrink: 0, flexDirection: 'row', alignItems: 'center' },
      rightSlot: { justifyContent: 'flex-end' },
      sideButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 5 },
      rightButton: { justifyContent: 'flex-end' },
      sideIcon: { fontSize: 20, fontWeight: '700' },
      backIcon: { fontSize: 26, fontWeight: '700', lineHeight: 26 },
      sideLabel: { fontSize: 14, fontWeight: '700' },
      headerTitle: { flex: 1, flexShrink: 1, textAlign: 'center', fontSize: 16, fontWeight: '700' },
      notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      bellIcon: { fontSize: 18 },
    }),
    s
  );
