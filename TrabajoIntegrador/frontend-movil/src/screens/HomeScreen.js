import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Boton from '../components/atoms/Boton';

export default function HomeScreen({ irASostenibilidad, irAQR }) {
    const [mensajeSede, setMensajeSede] = useState('Buscando tu ubicación...');
    const [sedeDetectada, setSedeDetectada] = useState(false);
    const [convenios, setConvenios] = useState([]); // <-- Guardamos la lista para mostrarla

    const IP_BACKEND = '192.168.1.11';
    const PUERTO = '8000';

    useEffect(() => {
        (async () => {
            // Si ya había convenios guardados offline de antes, los cargamos al abrir
            const guardados = await AsyncStorage.getItem('@convenios_offline');
            if (guardados) {
                try {
                    const parsed = JSON.parse(guardados);
                    if (Array.isArray(parsed.lista)) setConvenios(parsed.lista);
                } catch (e) {}
            }

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

    const traerConvenios = async () => {
        try {
            const token = await AsyncStorage.getItem('@token_jwt');
            
            if (!token) {
                return Alert.alert("Error", "No se encontró el token de sesión. Ingresá con DNI y contraseña.");
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
                const lista = Array.isArray(data) 
                    ? data 
                    : (data.convenios || data.data || data.resultados || data.agreements || []);

                setConvenios(lista); // <-- Actualiza la pantalla con las tarjetas

                // Y de paso los guardamos en AsyncStorage para trabajo offline real
                await AsyncStorage.setItem('@convenios_offline', JSON.stringify({
                    ultimaVez: new Date().toLocaleTimeString(),
                    lista: lista
                }));
            } else {
                Alert.alert("Error del servidor", data.mensaje || "No se pudieron obtener los convenios.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Modo Offline", "No se pudo conectar al servidor. Mostrando últimos convenios guardados en el dispositivo.");
        }
    };

    const guardarDatosOffline = async () => {
        try {
            const payload = {
                ultimaVez: new Date().toLocaleTimeString(),
                lista: convenios
            };
            await AsyncStorage.setItem('@convenios_offline', JSON.stringify(payload));
            
            Alert.alert(
                "Sincronización Offline", 
                `Se guardaron ${convenios.length} convenios en AsyncStorage.\nÚltima sync: ${payload.ultimaVez}`
            );
        } catch (e) {
            Alert.alert("Error", "Fallo al usar AsyncStorage");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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

            {/* LISTA VISUAL DE CONVENIOS */}
            {convenios.length > 0 && (
                <View style={styles.contenedorLista}>
                    <Text style={styles.subtituloLista}>
                        Convenios Cargados ({convenios.length})
                    </Text>
                    {convenios.map((item, index) => (
                        <View key={item.id || index} style={styles.itemConvenio}>
                            <View style={styles.filaSuperior}>
                                <Text style={styles.codigo}>{item.codigo_unico || `ID #${item.id}`}</Text>
                                <Text style={styles.estado}>{String(item.estado || '').toUpperCase()}</Text>
                            </View>
                            <Text style={styles.tituloConvenio}>{item.titulo}</Text>
                            {item.tipo && <Text style={styles.tipo}>Tipo: {item.tipo}</Text>}
                        </View>
                    ))}
                </View>
            )}

            <Boton titulo="Escanear Código QR" onPress={irAQR} />
            <Boton titulo="Sincronizar Datos (Offline)" onPress={guardarDatosOffline} />
            <Boton titulo="Impacto y Sostenibilidad" onPress={irASostenibilidad} secundario={true} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f4f4f4', justifyContent: 'center' },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#003366' },
    tarjetaSede: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', elevation: 3 },
    textoUbicacion: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#333', fontWeight: '500' },
    selectorManual: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
    textoManual: { textAlign: 'center', marginBottom: 15, color: '#666' },
    contenedorLista: { marginBottom: 20 },
    subtituloLista: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
    itemConvenio: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#003366', elevation: 2 },
    filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    codigo: { fontSize: 12, fontWeight: 'bold', color: '#666' },
    estado: { fontSize: 11, fontWeight: 'bold', color: '#006633', backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    tituloConvenio: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 4 },
    tipo: { fontSize: 12, color: '#555' }
});