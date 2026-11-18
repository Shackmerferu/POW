import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SostenibilidadScreen from '../screens/SostenibilidadScreen';
import InputTexto from '../components/molecules/InputTexto';
import Boton from '../components/atoms/Boton';
import LectorQRScreen from '../screens/LectorQRScreen';
import HomeScreen from '../screens/HomeScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';

export default function App() {
    const { colors } = useAppColorScheme();
    const [pantallaActual, setPantallaActual] = useState('login'); 
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [soportaBiometria, setSoportaBiometria] = useState(false);
    const [codigoEscaneado, setCodigoEscaneado] = useState(null);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolado = await LocalAuthentication.isEnrolledAsync();
            setSoportaBiometria(compatible && enrolado);
        })();
    }, []);

    const IP_BACKEND = '192.168.1.11';
    const PUERTO = '8000';

    const loginClasico = async () => {
        if (!dni || !password) return Alert.alert("Error", "Completá los datos");

        try {
            const respuesta = await fetch(`http://${IP_BACKEND}:${PUERTO}/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni: dni, contrasena: password })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                // Guardamos el token y el objeto del usuario (rol e id_unidad) para validar permisos en el QR
                await AsyncStorage.setItem('@token_jwt', data.token);
                await AsyncStorage.setItem('@usuario_actual', JSON.stringify(data.usuario || {}));
                setPantallaActual('home');
            } else {
                Alert.alert("Acceso denegado", data.mensaje || "Credenciales incorrectas");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error de conexión", "No se pudo conectar al servidor Node.js.");
        }
    };

    const loginBiometrico = async () => {
        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Acceso a Gestión de Convenios',
            fallbackLabel: 'Usar contraseña'
        });
        if (auth.success) setPantallaActual('home');
    };

    if (pantallaActual === 'qr') {
        return (
            <LectorQRScreen 
                alCerrar={() => setPantallaActual('home')} 
                alEscanear={(datoQR) => {
                    setCodigoEscaneado(datoQR);
                    setPantallaActual('home');
                }}
            />
        );
    }

    if (pantallaActual === 'home') {
        return (
            <HomeScreen 
                irASostenibilidad={() => setPantallaActual('sostenibilidad')} 
                irAQR={() => setPantallaActual('qr')}
                codigoQR={codigoEscaneado}
                limpiarQR={() => setCodigoEscaneado(null)}
            />
        );
    }

    if (pantallaActual === 'sostenibilidad') {
        return <SostenibilidadScreen alCerrar={() => setPantallaActual('home')} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.titulo, { color: colors.accent }]}>Convenios UNLPam</Text>
            <InputTexto placeholder="DNI o Legajo" valor={dni} onChangeText={setDni} />
            <InputTexto placeholder="Contraseña" valor={password} onChangeText={setPassword} oculto={true} />
            <Boton titulo="Ingresar" onPress={loginClasico} />
            {soportaBiometria && (
                <Boton titulo="Ingresar con Huella / FaceID" onPress={loginBiometrico} secundario={true} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f4' },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#003366' }
});
