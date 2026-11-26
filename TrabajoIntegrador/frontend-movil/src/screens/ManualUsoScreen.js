import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import Boton from '../components/atoms/Boton';
import HeaderApp from '../components/molecules/HeaderApp';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { escalarEstilos } from '../utils/escalaTexto';

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

export default function ManualUsoScreen({ alCerrarSesion, alVolver }) {
  const { colors } = useAppColorScheme();
  const { escala } = useFontScale();
  const styles = createStyles(colors, escala);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderApp alCerrarSesion={alCerrarSesion} alVolver={alVolver} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Manual de uso</Text>

        {SECCIONES_MANUAL.map((sec, i) => (
          <View key={i} style={styles.tarjeta}>
            <Text style={styles.cardTitulo}>{sec.titulo}</Text>
            <Text style={styles.texto}>{sec.texto}</Text>
          </View>
        ))}

        <Boton titulo="← Volver a convenios" onPress={alVolver} secundario={true} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
      titulo: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center', marginBottom: 14 },
      tarjeta: {
        backgroundColor: colors.backgroundElement,
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      cardTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.accent, marginBottom: 5 },
      texto: { fontSize: 13, color: colors.text, lineHeight: 19 },
    }),
    s
  );
