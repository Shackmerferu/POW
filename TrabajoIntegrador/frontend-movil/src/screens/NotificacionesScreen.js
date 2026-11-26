import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Boton from '../components/atoms/Boton';
import HeaderApp from '../components/molecules/HeaderApp';
import { API_BASE_URL } from '../constants/api';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { escalarEstilos } from '../utils/escalaTexto';

export default function NotificacionesScreen({ alCerrarSesion, alVolver }) {
  const { colors, colorScheme } = useAppColorScheme();
  const { escala } = useFontScale();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, escala);

  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const [tipoAvisoIndice, setTipoAvisoIndice] = useState(0);
  const avisoTimeout = useRef(null);

  const cargarAlertas = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      const resp = await fetch(`${API_BASE_URL}/api/dashboard/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        const data = await resp.json();
        const lista = Array.isArray(data) ? data : data.alertas || data.data || [];
        setAlertas(lista);
        return;
      }
      throw new Error('Endpoint no disponible');
    } catch {
      // Fallback: calcula vencimientos próximos desde la caché local
      try {
        const cacheStr = await AsyncStorage.getItem('@convenios_offline');
        if (cacheStr) {
          const { lista = [] } = JSON.parse(cacheStr);
          const hoy = new Date();
          const proximos = lista.filter((c) => {
            const fecha = c.fecha_vencimiento || c.vencimiento;
            if (!fecha) return false;
            const diffDias = Math.ceil((new Date(fecha) - hoy) / (1000 * 60 * 60 * 24));
            return diffDias <= 30;
          });
          setAlertas(proximos);
        }
      } catch {
        setAlertas([]);
      }
    } finally {
      setCargando(false);
    }
  }, []);

  // Las alertas se actualizan solas desde la API: al abrir la pantalla y
  // luego cada 30 segundos mientras permanezca visible.
  useEffect(() => {
    let activo = true;
    const actualizar = () => {
      if (activo) cargarAlertas();
    };

    Promise.resolve().then(actualizar);
    const intervalo = setInterval(actualizar, 30000);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [cargarAlertas]);

  // El aviso se muestra como una notificación debajo del header y se oculta
  // automáticamente a los 5 segundos.
  useEffect(() => {
    return () => {
      if (avisoTimeout.current) clearTimeout(avisoTimeout.current);
    };
  }, []);

  const probarAlertaPopup = () => {
    const tipos = ['advertencia', 'critico', 'positivo'];
    const tipoActual = tipos[tipoAvisoIndice % tipos.length];

    const primero = alertas.length > 0 ? alertas[0] : null;
    const titulo = primero?.titulo || primero?.nombre || 'Convenio Marco UNLPam';

    let mensaje = '';
    if (tipoActual === 'advertencia') {
      mensaje = `⚠️ Advertencia: "${titulo}" vence próximamente (requiere atención).`;
    } else if (tipoActual === 'critico') {
      mensaje = `🚨 Crítico: "${titulo}" se encuentra VENCIDO. Acción urgente requerida.`;
    } else {
      mensaje = `✅ Positivo: Operación exitosa. Todos los convenios están al día.`;
    }

    setAviso({ mensaje, tipo: tipoActual });
    setTipoAvisoIndice((prev) => prev + 1);

    if (avisoTimeout.current) clearTimeout(avisoTimeout.current);
    avisoTimeout.current = setTimeout(() => setAviso(null), 5000);
  };

  const isDark = colorScheme === 'dark';

  const getEstiloAviso = (tipo) => {
    switch (tipo) {
      case 'positivo':
        return {
          backgroundColor: isDark ? '#143823' : '#e6f4ea',
          borderColor: isDark ? '#8bd6a4' : '#006633',
          borderLeftColor: isDark ? '#8bd6a4' : '#006633',
        };
      case 'critico':
        return {
          backgroundColor: isDark ? '#3d1414' : '#fee2e2',
          borderColor: isDark ? '#ffb4ab' : '#b3261e',
          borderLeftColor: isDark ? '#ffb4ab' : '#b3261e',
        };
      case 'advertencia':
      default:
        return {
          backgroundColor: isDark ? '#3d2800' : '#fef3c7',
          borderColor: isDark ? '#ffd18a' : '#d97706',
          borderLeftColor: isDark ? '#ffd18a' : '#d97706',
        };
    }
  };

  const getTextoColorAviso = (tipo) => {
    switch (tipo) {
      case 'positivo':
        return isDark ? '#8bd6a4' : '#004d26';
      case 'critico':
        return isDark ? '#ffb4ab' : '#991b1b';
      case 'advertencia':
      default:
        return isDark ? '#ffd18a' : '#78350f';
    }
  };

  const alturaHeader = Math.max(insets.top, 8) + 50;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderApp alCerrarSesion={alCerrarSesion} alVolver={alVolver} />

      {aviso && (
        <View
          style={[
            styles.avisoFlotante,
            getEstiloAviso(aviso.tipo),
            { top: alturaHeader + 8 },
          ]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <Text style={[styles.avisoTexto, { color: getTextoColorAviso(aviso.tipo) }]}>
            {aviso.mensaje}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Notificaciones</Text>

        {cargando ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginVertical: 24 }} />
        ) : alertas.length === 0 ? (
          <View style={styles.tarjeta}>
            <Text style={styles.texto}>✅ No tenés convenios vencidos ni próximos a vencer.</Text>
          </View>
        ) : (
          alertas.map((item, idx) => (
            <View key={item.id || idx} style={[styles.tarjeta, styles.tarjetaAlerta]}>
              <Text style={styles.cardTitulo}>
                ⚠️ {item.titulo || item.nombre || `Convenio #${item.id || idx + 1}`}
              </Text>
              <Text style={styles.texto}>
                Vencimiento: {item.fecha_vencimiento || item.vencimiento || 'Próximo'}
              </Text>
              {item.estado && <Text style={styles.texto}>Estado: {item.estado}</Text>}
            </View>
          ))
        )}

        <Boton titulo="🔔 Probar Aviso en Pantalla" onPress={probarAlertaPopup} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
      titulo: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center', marginBottom: 8 },
      subInfo: { fontSize: 12, color: colors.textSecondary, marginBottom: 10, textAlign: 'center' },
      tarjeta: {
        backgroundColor: colors.backgroundElement,
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      tarjetaAlerta: { borderLeftWidth: 4, borderLeftColor: '#d97706' },
      cardTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.accent, marginBottom: 5 },
      texto: { fontSize: 13, color: colors.text, lineHeight: 19 },
      avisoFlotante: {
        position: 'absolute',
        left: 12,
        right: 12,
        zIndex: 10,
        elevation: 6,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      avisoTexto: { fontSize: 13, fontWeight: '600', lineHeight: 19 },
    }),
    s
  );
