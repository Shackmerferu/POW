import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Boton from '../components/atoms/Boton';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';

const IP_BACKEND = '127.0.0.1';
const BASE_URL = `http://${IP_BACKEND}:8000`;

const SECCIONES_MANUAL = [
  {
    titulo: '1. Ingreso y Seguridad (MFA)',
    texto: 'Iniciá sesión con tu DNI y contraseña. El sistema genera un código de verificación en dos pasos (MFA) para proteger tu cuenta antes de ingresar al panel.',
  },
  {
    titulo: '2. Panel, Filtros y Modo Offline',
    texto: 'Desde el inicio podés ver tus convenios según tu rol y usar el buscador en árbol (🌳 Filtros). Si perdés conexión, la app guarda una copia local en Modo Offline para consultar pendientes.',
  },
  {
    titulo: '3. Firma Digital, Huella y GPS',
    texto: 'Al abrir un convenio pendiente, dibujá tu firma manuscrita y validá tu identidad con huella o PIN del dispositivo. La app registra automáticamente tu ubicación GPS al firmar.',
  },
  {
    titulo: '4. PDF, Anexos e Integridad',
    texto: 'Podés abrir y compartir el PDF del convenio, subir anexos y verificar la marca de integridad (hash SHA-256) para garantizar que el documento no fue alterado.',
  },
  {
    titulo: '5. Mi Perfil e Identidad',
    texto: 'En la sección Perfil podés cambiar tu foto en miniatura, ajustar el tamaño de letra (chica, mediana o grande) y registrar tu firma manuscrita junto con la biometría.',
  },
];

export default function AyudaNotificacionesScreen({ alCerrar }) {
  const { colors } = useAppColorScheme();
  const [tab, setTab] = useState('alertas'); // 'alertas' | 'manual'
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [origenDatos, setOrigenDatos] = useState('servidor');

  const cargarAlertas = async () => {
    setCargando(true);
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      const resp = await fetch(`${BASE_URL}/api/dashboard/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        const data = await resp.json();
        const lista = Array.isArray(data) ? data : data.alertas || data.data || [];
        setAlertas(lista);
        setOrigenDatos('servidor');
        setCargando(false);
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
          setOrigenDatos('local');
        }
      } catch {
        setAlertas([]);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  const probarAlertaPopup = () => {
    if (alertas.length === 0) {
      return Alert.alert('🔔 Sin vencimientos', 'No hay convenios próximos a vencer en los próximos 30 días.');
    }
    const primero = alertas[0];
    const titulo = primero.titulo || primero.nombre || `Convenio #${primero.id || ''}`;
    Alert.alert(
      '⚠️ Alerta de Vencimiento',
      `El documento "${titulo}" requiere atención próxima.`
    );
  };

  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Notificaciones y Ayuda</Text>

      {/* Selector de pestañas */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'alertas' && styles.tabActiva]}
          onPress={() => setTab('alertas')}
        >
          <Text style={[styles.tabTxt, tab === 'alertas' && styles.tabTxtActiva]}>
            🔔 Vencimientos ({alertas.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'manual' && styles.tabActiva]}
          onPress={() => setTab('manual')}
        >
          <Text style={[styles.tabTxt, tab === 'manual' && styles.tabTxtActiva]}>
            📖 Manual de Uso
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'alertas' ? (
        <View>
          <Text style={styles.subInfo}>
            Fuente: {origenDatos === 'servidor' ? 'Servidor (/api/dashboard/alerts)' : 'Caché local'}
          </Text>

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

          <Boton titulo="🔄 Actualizar Alertas" onPress={cargarAlertas} secundario={true} />
          <Boton titulo="🔔 Probar Aviso en Pantalla" onPress={probarAlertaPopup} />
        </View>
      ) : (
        <View>
          {SECCIONES_MANUAL.map((sec, i) => (
            <View key={i} style={styles.tarjeta}>
              <Text style={styles.cardTitulo}>{sec.titulo}</Text>
              <Text style={styles.texto}>{sec.texto}</Text>
            </View>
          ))}
        </View>
      )}

      <Boton titulo="Volver al Panel" onPress={alCerrar} secundario={true} />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
    titulo: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center', marginBottom: 14 },
    tabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    tabBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      backgroundColor: colors.backgroundElement,
    },
    tabActiva: { backgroundColor: colors.accent, borderColor: colors.accent },
    tabTxt: { fontWeight: '600', color: colors.text, fontSize: 13 },
    tabTxtActiva: { color: '#fff' },
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
  });