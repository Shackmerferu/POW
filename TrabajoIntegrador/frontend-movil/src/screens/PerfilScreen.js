import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as LocalAuthentication from 'expo-local-authentication';

import Boton from '../components/atoms/Boton';
import HeaderApp from '../components/molecules/HeaderApp';
import FirmaPad from '../components/molecules/FirmaPad';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { ESCALAS_TEXTO, useFontScale } from '../contexts/FontScaleContext';

export default function PerfilScreen({ alCerrarSesion }) {
  const { colors, colorScheme, toggleColorScheme, setColorScheme } = useAppColorScheme();
  const { escala, cambiarEscala } = useFontScale();
  const [usuario, setUsuario] = useState(null);
  const [fotoUri, setFotoUri] = useState(null);
  const [trazos, setTrazos] = useState([]);
  const [identidad, setIdentidad] = useState(null);

  useEffect(() => {
    (async () => {
      const uStr = await AsyncStorage.getItem('@usuario_actual');
      if (uStr) {
        try { setUsuario(JSON.parse(uStr)); } catch {}
      }
      const fotoGuardada = await AsyncStorage.getItem('@perfil_foto');
      if (fotoGuardada) setFotoUri(fotoGuardada);

      const idStr = await AsyncStorage.getItem('@identidad_registrada');
      if (idStr) {
        try { setIdentidad(JSON.parse(idStr)); } catch {}
      }
    })();
  }, []);

  const cambiarTema = () => {
    if (typeof toggleColorScheme === 'function') {
      toggleColorScheme();
    } else if (typeof setColorScheme === 'function') {
      setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    }
  };

  const seleccionarFoto = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.length) return;
      const uri = res.assets[0].uri;
      setFotoUri(uri);
      await AsyncStorage.setItem('@perfil_foto', uri);
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const registrarIdentidad = async () => {
    if (trazos.length < 5) {
      return Alert.alert('Falta firma', 'Dibujá tu firma manuscrita antes de registrar tu identidad.');
    }

    const bio = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Validar biometría para registrar identidad',
      fallbackLabel: 'Usar PIN del dispositivo',
    });

    if (!bio.success) {
      return Alert.alert('Cancelado', 'Se requiere huella o FaceID para completar el registro.');
    }

    const registro = {
      fecha: new Date().toLocaleString(),
      trazos: trazos.length,
      biometria: true,
      usuario: usuario?.nombre_completo || 'Usuario',
    };

    await AsyncStorage.setItem('@identidad_registrada', JSON.stringify(registro));
    setIdentidad(registro);
    Alert.alert('✅ Identidad Registrada', 'Tu firma manuscrita y validación biométrica quedaron guardadas.');
  };

  const styles = createStyles(colors, escala);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderApp alCerrarSesion={alCerrarSesion} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Mi Perfil e Identidad</Text>

        {/* Datos, Foto en miniatura y Botón de Tema */}
        <View style={styles.tarjeta}>
          <View style={styles.filaPerfil}>
            <TouchableOpacity onPress={seleccionarFoto} style={styles.avatarWrap}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInicial}>
                    {(usuario?.nombre_completo || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.linkFoto}>Cambiar foto</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{usuario?.nombre_completo || 'Usuario UNLPam'}</Text>
              <Text style={styles.dato}>DNI: {usuario?.dni || '-'}</Text>
              <Text style={styles.dato}>Legajo: {usuario?.legajo || '-'}</Text>
              <Text style={styles.dato}>Rol: {String(usuario?.rol || '-').toUpperCase()}</Text>
            </View>

            <TouchableOpacity
              onPress={cambiarTema}
              style={styles.btnTema}
              accessibilityRole="button"
              accessibilityLabel="Cambiar entre modo claro y oscuro"
            >
              <Text style={styles.iconoTema}>
                {colorScheme === 'dark' ? '☀️' : '🌙'}
              </Text>
              <Text style={styles.textoTema}>
                {colorScheme === 'dark' ? 'Claro' : 'Oscuro'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tamaño de letra */}
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>🔠 Tamaño de letra</Text>
          <View style={styles.filaBotones}>
            {ESCALAS_TEXTO.map((op) => (
              <TouchableOpacity
                key={op.label}
                style={[styles.chip, escala === op.valor && styles.chipActivo]}
                onPress={() => cambiarEscala(op.valor)}
              >
                <Text style={[styles.chipTexto, escala === op.valor && styles.chipTextoActivo]}>
                  {op.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Registrar mi Identidad */}
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>🪪 Registrar mi Identidad</Text>
          {identidad ? (
            <View style={styles.badgeOk}>
              <Text style={styles.textoOk}>✅ Identidad verificada el {identidad.fecha}</Text>
            </View>
          ) : (
            <Text style={styles.dato}>Todavía no registraste tu firma y huella.</Text>
          )}

          <FirmaPad onCambioFirma={setTrazos} colores={colors} />
          <Boton titulo="Guardar Firma + Validar Huella" onPress={registrarIdentidad} />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, s) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
    titulo: { fontSize: 22 * s, fontWeight: 'bold', color: colors.accent, textAlign: 'center', marginBottom: 16 },
    tarjeta: {
      backgroundColor: colors.backgroundElement,
      padding: 15,
      borderRadius: 10,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filaPerfil: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatarWrap: { alignItems: 'center' },
    avatar: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: colors.accent },
    avatarPlaceholder: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInicial: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
    linkFoto: { fontSize: 11 * s, color: colors.accent, marginTop: 4, fontWeight: '600' },
    nombre: { fontSize: 17 * s, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    dato: { fontSize: 13 * s, color: colors.textSecondary, marginBottom: 2 },
    btnTema: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      minWidth: 58,
    },
    iconoTema: { fontSize: 20 },
    textoTema: { fontSize: 11 * s, fontWeight: '600', color: colors.text, marginTop: 2 },
    subtitulo: { fontSize: 15 * s, fontWeight: 'bold', color: colors.accent, marginBottom: 10 },
    filaBotones: { flexDirection: 'row', gap: 8 },
    chip: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    chipActivo: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipTexto: { fontSize: 13 * s, fontWeight: '600', color: colors.text },
    chipTextoActivo: { color: '#fff' },
    badgeOk: {
      backgroundColor: colors.positiveBackground,
      padding: 8,
      borderRadius: 6,
      marginBottom: 8,
    },
    textoOk: { color: colors.positive, fontWeight: 'bold', fontSize: 12 * s },
  });