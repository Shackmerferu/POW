import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

import InputTexto from '../components/molecules/InputTexto';
import Boton from '../components/atoms/Boton';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import AyudaNotificacionesScreen from '../screens/AyudaNotificacionesScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { API_BASE_URL } from '../constants/api';

export default function App() {
    const { colors } = useAppColorScheme();
    const [cargandoSesion, setCargandoSesion] = useState(true);
    const [pantallaActual, setPantallaActual] = useState('login');
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [soportaBiometria, setSoportaBiometria] = useState(false);
    const { codigoQR: parametroQR } = useLocalSearchParams();
    const codigoEscaneado = Array.isArray(parametroQR) ? parametroQR[0] : parametroQR;

    // Estados para MFA simulado
    const [esperandoMFA, setEsperandoMFA] = useState(false);
    const [codigoMFAGenerado, setCodigoMFAGenerado] = useState('');
    const [codigoMFAIngresado, setCodigoMFAIngresado] = useState('');
    const [sesionPendiente, setSesionPendiente] = useState(null);

    const IP_BACKEND = 'localhost';
    const PUERTO = '8000';

    useEffect(() => {
        (async () => {
            try {
                // 1. Si ya está logueado, no vuelve a pedir login
                const tokenGuardado = await AsyncStorage.getItem('@token_jwt');
                if (tokenGuardado) {
                    setPantallaActual('home');
                }

                // 2. Verificar soporte biométrico
                const compatible = await LocalAuthentication.hasHardwareAsync();
                const enrolado = await LocalAuthentication.isEnrolledAsync();
                setSoportaBiometria(compatible && enrolado);
            } finally {
                setCargandoSesion(false);
            }
        })();
    }, []);

    const loginClasico = async () => {
        if (!dni || !password) return Alert.alert("Faltan datos", "Ingresá tu DNI o correo y tu contraseña para continuar.");

        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni: dni, contrasena: password })
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.token) {
                // Disparamos MFA simulado (SMS/Mail)
                const codigo = Math.floor(100000 + Math.random() * 900000).toString();
                setCodigoMFAGenerado(codigo);
                setSesionPendiente({ token: data.token, usuario: data.usuario || {} });
                setEsperandoMFA(true);

                Alert.alert(
                    "Código de verificación",
                    `Para esta demostración, usá este código: ${codigo}`
                );
            } else {
                Alert.alert("No pudimos iniciar sesión", data.mensaje || "Revisá tu DNI o correo y tu contraseña.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Sin conexión", "No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.");
        }
    };

    const confirmarMFA = async () => {
        if (codigoMFAIngresado.trim() !== codigoMFAGenerado) {
            return Alert.alert("El código no coincide", "Revisá el código de 6 dígitos e intentá de nuevo.");
        }

        await AsyncStorage.setItem('@token_jwt', sesionPendiente.token);
        await AsyncStorage.setItem('@usuario_actual', JSON.stringify(sesionPendiente.usuario));
        await AsyncStorage.setItem('@biometria_habilitada', 'true');

        setEsperandoMFA(false);
        setCodigoMFAIngresado('');
        setSesionPendiente(null);
        setPantallaActual('home');
    };

    const loginBiometrico = async () => {
        const tokenPrevio = await AsyncStorage.getItem('@token_jwt_biometria');
        const userPrevio = await AsyncStorage.getItem('@usuario_actual');

        if (!tokenPrevio) {
            return Alert.alert(
                "Primero iniciá sesión",
                "Ingresá con tu DNI o correo y contraseña para habilitar el acceso con huella o reconocimiento facial."
            );
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Acceso a Gestión de Convenios',
            fallbackLabel: 'Usar contraseña'
        });

        if (auth.success) {
            await AsyncStorage.setItem('@token_jwt', tokenPrevio);
            if (userPrevio) await AsyncStorage.setItem('@usuario_actual', userPrevio);
            setPantallaActual('home');
        }
    };

    const cerrarSesion = async () => {
        // Guardamos respaldo para permitir re-ingreso biométrico en la demo
        const tokenActual = await AsyncStorage.getItem('@token_jwt');
        if (tokenActual) {
            await AsyncStorage.setItem('@token_jwt_biometria', tokenActual);
        }
        await AsyncStorage.removeItem('@token_jwt');
        setPantallaActual('login');
    };

    if (cargandoSesion) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (pantallaActual === 'home') {
        return (
            <HomeScreen
            irAAyuda={() => setPantallaActual('ayuda')}
            irAPerfil={() => setPantallaActual('perfil')}
                codigoQR={codigoEscaneado}
                limpiarQR={() => router.setParams({ codigoQR: undefined })}
                cerrarSesion={cerrarSesion}
            />
        );
    }

    if (pantallaActual === 'perfil') {
  return <PerfilScreen alCerrar={() => setPantallaActual('home')} />;
}
if (pantallaActual === 'ayuda') {
  return <AyudaNotificacionesScreen alCerrar={() => setPantallaActual('home')} />;
}

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.titulo, { color: colors.accent }]}>Gestión de convenios</Text>

            {esperandoMFA ? (
                <>
                    <Text style={{ color: colors.text, textAlign: 'center', marginBottom: 15 }}>
                        Ingresá el código de 6 dígitos que aparece en el mensaje para confirmar tu identidad.
                    </Text>
                    <InputTexto
                        placeholder="Código de verificación"
                        valor={codigoMFAIngresado}
                        onChangeText={setCodigoMFAIngresado}
                    />
                    <Boton titulo="Confirmar código" onPress={confirmarMFA} />
                    <Boton
                        titulo="Volver a mostrar el código"
                        onPress={() => Alert.alert("Código de verificación", `Para esta demostración, usá este código: ${codigoMFAGenerado}`)}
                        secundario={true}
                    />
                </>
            ) : (
                <>
                    <InputTexto placeholder="DNI o correo electrónico" valor={dni} onChangeText={setDni} />
                    <InputTexto placeholder="Contraseña" valor={password} onChangeText={setPassword} oculto={true} />
                    <Boton titulo="Ingresar" onPress={loginClasico} />
                    {soportaBiometria && (
                        <Boton titulo="Ingresar con huella o rostro" onPress={loginBiometrico} secundario={true} />
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f4' },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#003366' }
});
