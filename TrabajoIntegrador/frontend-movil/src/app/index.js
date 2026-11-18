import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- AGREGAMOS ESTO

import SostenibilidadScreen from '../screens/SostenibilidadScreen';
import InputTexto from '../components/molecules/InputTexto';
import Boton from '../components/atoms/Boton';
import LectorQRScreen from '../screens/LectorQRScreen';
import HomeScreen from '../screens/HomeScreen';

export default function App() {
    const [pantallaActual, setPantallaActual] = useState('login'); 
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [soportaBiometria, setSoportaBiometria] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolado = await LocalAuthentication.isEnrolledAsync();
            setSoportaBiometria(compatible && enrolado);
        })();
    }, []);

    // --- ACÁ EMPIEZA LA CONEXIÓN REAL AL BACKEND ---
    const IP_BACKEND = '192.168.0.15'; // REEMPLAZÁ ESTO POR LA IP DE TU COMPU (ipconfig)
    const PUERTO = '3000'; // ASEGURATE DE QUE SEA EL PUERTO DE TU NODE.JS

    const loginClasico = async () => {
        if (!dni || !password) return Alert.alert("Error", "Completá los datos");

        try {
            const respuesta = await fetch(`http://${IP_BACKEND}:${PUERTO}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dni, password })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                // Guardamos el JWT en el celular para el trabajo offline / sesión
                await AsyncStorage.setItem('@token_jwt', data.token);
                setPantallaActual('home'); // Avanzamos si el backend da el OK
            } else {
                Alert.alert("Acceso denegado", data.mensaje || "Credenciales incorrectas");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error de conexión", "No se pudo conectar al servidor Node.js. Revisá la IP y que tu compu/celular estén en el mismo WiFi.");
        }
    };
    // --- ACÁ TERMINA LA CONEXIÓN REAL ---

    const loginBiometrico = async () => {
        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Acceso a Gestión de Convenios',
            fallbackLabel: 'Usar contraseña'
        });
        if (auth.success) setPantallaActual('qr');
    };

    // Navegación condicional
    if (pantallaActual === 'qr') {
        return <LectorQRScreen alCerrar={() => setPantallaActual('home')} />;
    }

    if (pantallaActual === 'home') {
        return <HomeScreen irASostenibilidad={() => setPantallaActual('sostenibilidad')} />;
    }

    if (pantallaActual === 'sostenibilidad') {
        return <SostenibilidadScreen alCerrar={() => setPantallaActual('home')} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Convenios UNLPam</Text>
            
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