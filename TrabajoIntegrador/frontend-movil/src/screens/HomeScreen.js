import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Boton from '../components/atoms/Boton';

export default function HomeScreen({ irASostenibilidad }) {
    const [mensajeSede, setMensajeSede] = useState('Buscando tu ubicación...');
    const [sedeDetectada, setSedeDetectada] = useState(false);

    // Configuración de tu servidor Node.js
    const IP_BACKEND = '192.168.0.15'; // <--- LA MISMA IP QUE USASTE EN EL LOGIN
    const PUERTO = '3000';

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setMensajeSede('Ubicación denegada. Usá la selección manual.');
                return;
            }
            try {
                let location = await Location.getCurrentPositionAsync({});
                const latFacultad = -35.658;
                const lonFacultad = -63.753;
                
                const distanciaLat = Math.abs(location.coords.latitude - latFacultad);
                const distanciaLon = Math.abs(location.coords.longitude - lonFacultad);

                if (distanciaLat < 0.05 && distanciaLon < 0.05) {
                    setMensajeSede('📍 ¡Estás en la Facu de Ingeniería!\nAcceso rápido habilitado.');
                    setSedeDetectada(true);
                } else {
                    setMensajeSede('📍 Estás fuera del campus.');
                }
            } catch (error) {
                setMensajeSede('Error al obtener el GPS.');
            }
        })();
    }, []);

    // --- CONEXIÓN REAL AL BACKEND PARA TRAER LOS CONVENIOS ---
    const traerConvenios = async () => {
        try {
            // Recuperamos el token JWT guardado en el dispositivo
            const token = await AsyncStorage.getItem('@token_jwt');
            
            if (!token) {
                return Alert.alert("Error", "No se encontró el token de sesión. Volvé a loguearte.");
            }

            const respuesta = await fetch(`http://${IP_BACKEND}:${PUERTO}/api/agreements`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                // Muestra la cantidad de convenios reales devueltos por MySQL
                Alert.alert("Sincronización Exitosa", `Se obtuvieron ${data.length || 0} convenios desde la API.`);
            } else {
                Alert.alert("Error del servidor", data.mensaje || "No se pudieron obtener los convenios.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error de red", "No se pudo conectar con el backend de Node.js. Verificá el servidor.");
        }
    };
    // ---------------------------------------------------------

    // Requisito: Persistencia local para trabajo sin conexión
    const guardarDatosOffline = async () => {
        try {
            const datosSimulados = JSON.stringify({ pendientesSync: 2, ultimaVez: new Date().toLocaleTimeString() });
            await AsyncStorage.setItem('@convenios_offline', datosSimulados);
            
            const lectura = await AsyncStorage.getItem('@convenios_offline');
            const parseado = JSON.parse(lectura);
            
            Alert.alert("Sincronización simulada", `Datos guardados en AsyncStorage.\nÚltima sync: ${parseado.ultimaVez}`);
        } catch (e) {
            Alert.alert("Error", "Fallo al usar AsyncStorage");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Panel de Gestión</Text>
            
            <View style={styles.tarjetaSede}>
                <Text style={styles.textoUbicacion}>{mensajeSede}</Text>
                
                {sedeDetectada ? (
                    <Boton titulo="Ver Convenios de Ingeniería" onPress={traerConvenios} />
                ) : (
                    <View style={styles.selectorManual}>
                        <Text style={styles.textoManual}>Seleccioná tu sede manualmente:</Text>
                        <Boton titulo="Sede General Pico" onPress={traerConvenios} secundario={true}/>
                    </View>
                )}
            </View>

            <Boton titulo="Sincronizar Datos (Offline)" onPress={guardarDatosOffline} />
            <Boton titulo="Impacto y Sostenibilidad" onPress={irASostenibilidad} secundario={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4', justifyContent: 'center' },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#003366' },
    tarjetaSede: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', elevation: 3 },
    textoUbicacion: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#333', fontWeight: '500' },
    selectorManual: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
    textoManual: { textAlign: 'center', marginBottom: 15, color: '#666' }
});