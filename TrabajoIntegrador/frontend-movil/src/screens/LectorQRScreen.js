import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Boton from '../components/atoms/Boton';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { escalarEstilos } from '../utils/escalaTexto';

/** @param {{ alCerrar: () => void, alEscanear?: (codigo: string) => void }} props */
export default function LectorQRScreen({ alCerrar, alEscanear }) {
    const { colors } = useAppColorScheme();
    const { escala } = useFontScale();
    const styles = createStyles(colors, escala);
    const [permiso, pedirPermiso] = useCameraPermissions();
    const [escaneado, setEscaneado] = useState(false);
    const [tiempo, setTiempo] = useState(60);

    // Temporizador de 60 segundos exactos que pide la cátedra
    useEffect(() => {
        let intervalo;
        if (permiso?.granted && !escaneado && tiempo > 0) {
            intervalo = setInterval(() => setTiempo(t => t - 1), 1000);
        }
        return () => clearInterval(intervalo);
    }, [permiso, escaneado, tiempo]);

    useEffect(() => {
        if (tiempo !== 0 || escaneado) return undefined;

        const aviso = setTimeout(() => {
            setEscaneado(true);
            Alert.alert(
                "Tiempo agotado", 
                "No pudimos leer ningún código. Volvé a intentarlo cuando tengas el convenio a mano.",
                [{ text: "Volver a convenios", onPress: alCerrar }]
            );
        }, 0);

        return () => clearTimeout(aviso);
    }, [tiempo, escaneado, alCerrar]);

    // Si aún no hay permisos o se denegaron
    if (!permiso) return <View />;
    if (!permiso.granted) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={styles.texto}>Para leer el código del convenio, necesitamos permiso para usar la cámara.</Text>
                <Boton titulo="Permitir acceso a la cámara" onPress={pedirPermiso} />
                <Boton titulo="Cancelar" onPress={alCerrar} secundario={true} />
            </View>
        );
    }

    const manejarEscaneo = ({ data }) => {
        setEscaneado(true);
        Alert.alert(
            "Convenio encontrado",
            "Ya encontramos el convenio. Vamos a abrir sus detalles.",
            [{ text: "Ver convenio", onPress: () => alEscanear?.(data) }]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={styles.titulo}>Escanear código del convenio</Text>
            <Text style={styles.temporizador}>Buscando código… {tiempo} s</Text>
            
           <View style={styles.marcoCamara}>
    <CameraView
        style={{ flex: 1 }} // <--- Este es el cambio clave
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={escaneado ? undefined : manejarEscaneo}
    />
</View>

            <Boton titulo="Cancelar y volver" onPress={alCerrar} secundario={true} />
        </View>
    );
}

const createStyles = (colors, s = 1) => escalarEstilos(StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: colors.accent },
    temporizador: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: colors.warning },
    texto: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: colors.text },
    marcoCamara: { height: 350, width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 20, borderWidth: 2, borderColor: colors.accent }
}), s);
