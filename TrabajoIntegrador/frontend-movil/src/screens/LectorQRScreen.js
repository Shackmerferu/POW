import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Boton from '../components/atoms/Boton';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';

export default function LectorQRScreen({ alCerrar }) {
    const { colors } = useAppColorScheme();
    const styles = createStyles(colors);
    const [permiso, pedirPermiso] = useCameraPermissions();
    const [escaneado, setEscaneado] = useState(false);
    const [tiempo, setTiempo] = useState(60);

    // Temporizador de 60 segundos exactos que pide la cátedra
    useEffect(() => {
        let intervalo;
        if (permiso?.granted && !escaneado && tiempo > 0) {
            intervalo = setInterval(() => setTiempo(t => t - 1), 1000);
        } else if (tiempo === 0 && !escaneado) {
            setEscaneado(true);
            Alert.alert(
                "Tiempo agotado", 
                "No se reconoció ningún código QR en 1 minuto.",
                [{ text: "Volver", onPress: alCerrar }]
            );
        }
        return () => clearInterval(intervalo);
    }, [permiso, escaneado, tiempo]);

    // Si aún no hay permisos o se denegaron
    if (!permiso) return <View />;
    if (!permiso.granted) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={styles.texto}>Necesitamos acceso a la cámara para leer el expediente</Text>
                <Boton titulo="Otorgar Permiso" onPress={pedirPermiso} />
                <Boton titulo="Cancelar" onPress={alCerrar} secundario={true} />
            </View>
        );
    }

    const manejarEscaneo = ({ data }) => {
        setEscaneado(true);
        Alert.alert(
            "Expediente Encontrado", 
            `Código seguro: ${data}\nRedirigiendo a la ficha del convenio...`,
            [{ text: "OK", onPress: alCerrar }]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={styles.titulo}>Escáner de Expedientes</Text>
            <Text style={styles.temporizador}>Cierre automático en: {tiempo}s</Text>
            
           <View style={styles.marcoCamara}>
    <CameraView
        style={{ flex: 1 }} // <--- Este es el cambio clave
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={escaneado ? undefined : manejarEscaneo}
    />
</View>

            <Boton titulo="Cancelar Escaneo" onPress={alCerrar} secundario={true} />
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: colors.accent },
    temporizador: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: colors.warning },
    texto: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: colors.text },
    marcoCamara: { height: 350, width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 20, borderWidth: 2, borderColor: colors.accent }
});
