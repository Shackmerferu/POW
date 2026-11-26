import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

import InputTexto from '../components/molecules/InputTexto';
import Boton from '../components/atoms/Boton';
import HomeScreen from '../screens/HomeScreen';
import ManualUsoScreen from '../screens/ManualUsoScreen';
import NotificacionesScreen from '../screens/NotificacionesScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { useTabBar } from '../contexts/TabBarContext';
import { API_BASE_URL } from '../constants/api';
import { limpiarSesionActual } from '../utils/sesion';
import { escalarEstilos } from '../utils/escalaTexto';

export default function App() {
    const { colors } = useAppColorScheme();
    const { escala } = useFontScale();
    const { setTabBarHidden } = useTabBar();
    const navigation = useNavigation();
    const styles = createStyles(colors, escala);
    const [cargandoSesion, setCargandoSesion] = useState(true);
    const [pantallaActual, setPantallaActual] = useState('login');
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [soportaBiometria, setSoportaBiometria] = useState(false);
    const { codigoQR: parametroQR, vista } = useLocalSearchParams();
    const vistaActual = Array.isArray(vista) ? vista[0] : vista;
    const codigoEscaneado = Array.isArray(parametroQR) ? parametroQR[0] : parametroQR;

    // Estados para MFA simulado
    const [esperandoMFA, setEsperandoMFA] = useState(false);
    const [codigoMFAGenerado, setCodigoMFAGenerado] = useState('');
    const [codigoMFAIngresado, setCodigoMFAIngresado] = useState('');
    const [sesionPendiente, setSesionPendiente] = useState(null);

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

    // El footer (barra de pestañas) no debe mostrarse en la pantalla de login.
    useEffect(() => {
        setTabBarHidden(pantallaActual === 'login' || vistaActual === 'login');
        return () => setTabBarHidden(false);
    }, [pantallaActual, vistaActual, setTabBarHidden]);

    // Al volver a la pestaña Convenios siempre mostramos el listado, no una
    // ficha, el buscador avanzado ni las pantallas de notificaciones/manual.
    useEffect(() => {
        const volverAlListado = () => {
            setPantallaActual((actual) =>
                actual === 'notificaciones' || actual === 'manual' ? 'home' : actual
            );
        };
        const alEnfocar = navigation.addListener('focus', volverAlListado);
        const alPresionar = navigation.addListener('tabPress', volverAlListado);
        return () => {
            alEnfocar();
            alPresionar();
        };
    }, [navigation]);

    const irAInicio = () => {
        setPantallaActual('home');
        router.setParams({ vista: undefined });
    };

    const abrirNotificaciones = () => {
        setPantallaActual('notificaciones');
        router.setParams({ vista: undefined });
    };

    const abrirManual = () => {
        setPantallaActual('manual');
        router.setParams({ vista: undefined });
    };

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
        router.setParams({ vista: undefined });
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
            router.setParams({ vista: undefined });
        }
    };

    const cerrarSesion = async () => {
        await limpiarSesionActual();
        setPantallaActual('login');
        router.setParams({ vista: undefined });
    };

    if (cargandoSesion) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (vistaActual !== 'login' && (pantallaActual === 'home' || vistaActual === 'convenios')) {
        return (
            <HomeScreen
                irANotificaciones={abrirNotificaciones}
                irAManual={abrirManual}
                codigoQR={codigoEscaneado}
                limpiarQR={() => router.setParams({ codigoQR: undefined })}
                cerrarSesion={cerrarSesion}
            />
        );
    }

    if (pantallaActual === 'notificaciones' && vistaActual !== 'login') {
        return (
            <NotificacionesScreen
                alVolver={irAInicio}
                alCerrarSesion={cerrarSesion}
            />
        );
    }

    if (pantallaActual === 'manual' && vistaActual !== 'login') {
        return (
            <ManualUsoScreen
                alVolver={irAInicio}
                alCerrarSesion={cerrarSesion}
            />
        );
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

const createStyles = (colors, s = 1) =>
    escalarEstilos(
        StyleSheet.create({
            container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
            titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: colors.accent },
        }),
        s
    );
