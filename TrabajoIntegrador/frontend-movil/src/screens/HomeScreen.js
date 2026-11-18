import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Boton from '../components/atoms/Boton';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
export default function HomeScreen({ irASostenibilidad, irAQR, codigoQR, limpiarQR }) {
    const [mensajeSede, setMensajeSede] = useState('Buscando tu ubicación...');
    const [sedeDetectada, setSedeDetectada] = useState(false);
    const [convenios, setConvenios] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState(null);

    const [paginaActual, setPaginaActual] = useState(1);
    const [convenioSeleccionado, setConvenioSeleccionado] = useState(null);
    const ITEMS_POR_PAGINA = 10;

    const IP_BACKEND = '192.168.1.11';
    const PUERTO = '8000';

    // Función auxiliar que filtra la lista si el usuario es "consulta" (solo firmados y aprobados)
    const filtrarPorRol = (listaCompleta, user) => {
        const rol = String(user?.rol || '').trim().toLowerCase();
        if (rol === 'consulta') {
            return listaCompleta.filter(c => {
                const est = String(c.estado || '').trim().toLowerCase();
                return est === 'firmado' || est === 'aprobado';
            });
        }
        return listaCompleta;
    };

    useEffect(() => {
        (async () => {
            let userObj = null;
            const userStr = await AsyncStorage.getItem('@usuario_actual');
            if (userStr) {
                try { 
                    userObj = JSON.parse(userStr);
                    setUsuarioActual(userObj); 
                } catch (e) {}
            }

            const guardados = await AsyncStorage.getItem('@convenios_offline');
            if (guardados) {
                try {
                    const parsed = JSON.parse(guardados);
                    if (Array.isArray(parsed.lista)) {
                        setConvenios(filtrarPorRol(parsed.lista, userObj));
                    }
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

    // Valida si el usuario tiene permiso para abrir la ficha (desde la lista o desde el QR)
    const verificarPermisoYAbrir = async (convenio) => {
        let user = usuarioActual;
        if (!user) {
            const userStr = await AsyncStorage.getItem('@usuario_actual');
            if (userStr) user = JSON.parse(userStr);
        }

        const rol = String(user?.rol || '').trim().toLowerCase();
        const estado = String(convenio.estado || '').trim().toLowerCase();

        // El rol "consulta" solo puede abrir convenios en estado "firmado" o "aprobado"
        if (rol === 'consulta' && estado !== 'firmado' && estado !== 'aprobado') {
            return Alert.alert(
                "Permiso Denegado",
                `El rol de Consulta solo puede acceder a convenios Firmados o Aprobados (este convenio está en '${convenio.estado}').`
            );
        }

        setConvenioSeleccionado(convenio);
    };

    // Abre o descarga el PDF del convenio en el celular usando la ruta del backend
   // Descarga segura utilizando tu api/documentos.js con auditoría y token
   // Descarga segura utilizando tu api/documentos.js con auditoría, token y FileSystem
    const descargarPDF = async (convenio) => {
        try {
            const token = await AsyncStorage.getItem('@token_jwt');
            if (!token) {
                return Alert.alert("Error", "No se encontró el token de sesión.");
            }

            // 1. Consultamos el ID del documento asociado a este convenio en la base de datos
            const respuesta = await fetch(`http://${IP_BACKEND}:${PUERTO}/api/documents/convenio/${convenio.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.documentos && data.documentos.length > 0) {
                const idDocumento = data.documentos[0].id;
                const nombreArchivo = data.documentos[0].ruta_archivo || `Convenio_${convenio.codigo_unico}.pdf`;

                // 2. Ruta protegida del backend que valida el token y registra la auditoría
                const urlDescarga = `http://${IP_BACKEND}:${PUERTO}/api/documents/${idDocumento}/download`;
                const rutaDestino = `${FileSystem.documentDirectory}${nombreArchivo}`;

                Alert.alert("Descargando", "Obteniendo documento seguro del servidor...");

                // 3. Descargamos el archivo físicamente enviando el token JWT en los headers
                const downloadRes = await FileSystem.downloadAsync(
                    urlDescarga,
                    rutaDestino,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (downloadRes.status === 200) {
                    // 4. Abrimos el PDF con el visor del sistema del celular o permitimos compartirlo
                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(downloadRes.uri);
                    } else {
                        Alert.alert("Éxito", "El PDF se descargó correctamente en el dispositivo.");
                    }
                } else {
                    Alert.alert("Error", "El servidor no pudo completar la descarga.");
                }
            } else {
                Alert.alert("Sin Documentos", "Este convenio no tiene un archivo PDF registrado en la base de datos.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error de conexión", "No se pudo procesar la descarga segura del documento.");
        }
    };
    useEffect(() => {
        if (!codigoQR) return;

        const procesarQR = async () => {
            let listaActual = convenios;
            if (listaActual.length === 0) {
                listaActual = await traerConvenios();
            }

            const qrLimpio = String(codigoQR).trim().toLowerCase();
            const encontrado = listaActual.find(c => 
                String(c.codigo_unico || '').toLowerCase() === qrLimpio ||
                qrLimpio.includes(String(c.codigo_unico || '').toLowerCase()) ||
                String(c.id) === qrLimpio
            );

            if (encontrado) {
                await verificarPermisoYAbrir(encontrado);
            } else {
                Alert.alert(
                    "Permiso Denegado o No Encontrado",
                    `El convenio (${codigoQR}) no existe o no está Firmado/Aprobado para tu rol.`
                );
            }
            if (limpiarQR) limpiarQR();
        };

        procesarQR();
    }, [codigoQR]);

    const traerConvenios = async () => {
        try {
            const token = await AsyncStorage.getItem('@token_jwt');
            if (!token) {
                Alert.alert("Error", "No se encontró el token de sesión.");
                return [];
            }

            let userObj = usuarioActual;
            if (!userObj) {
                const userStr = await AsyncStorage.getItem('@usuario_actual');
                if (userStr) userObj = JSON.parse(userStr);
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
                const listaCruda = Array.isArray(data) 
                    ? data 
                    : (data.convenios || data.data || data.resultados || data.agreements || []);

                // Filtramos por rol si es consulta (solo firmados y aprobados)
                const listaFiltrada = filtrarPorRol(listaCruda, userObj);

                setConvenios(listaFiltrada);
                setPaginaActual(1);

                await AsyncStorage.setItem('@convenios_offline', JSON.stringify({
                    ultimaVez: new Date().toLocaleTimeString(),
                    lista: listaFiltrada
                }));
                return listaFiltrada;
            } else {
                Alert.alert("Error del servidor", data.mensaje || "No se pudieron obtener los convenios.");
                return [];
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Modo Offline", "Sin conexión al servidor. Mostrando convenios guardados.");
            return convenios;
        }
    };

    const guardarDatosOffline = async () => {
        try {
            const payload = {
                ultimaVez: new Date().toLocaleTimeString(),
                lista: convenios
            };
            await AsyncStorage.setItem('@convenios_offline', JSON.stringify(payload));
            Alert.alert("Sincronización Offline", `Se guardaron ${convenios.length} convenios.\nÚltima sync: ${payload.ultimaVez}`);
        } catch (e) {
            Alert.alert("Error", "Fallo al usar AsyncStorage");
        }
    };

    // --- VISTA DE FICHA DEL CONVENIO 
    if (convenioSeleccionado) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.titulo}>Ficha del Convenio</Text>
                <View style={styles.tarjetaSede}>
                    <View style={styles.filaSuperior}>
                        <Text style={styles.codigo}>{convenioSeleccionado.codigo_unico || `ID #${convenioSeleccionado.id}`}</Text>
                        <Text style={styles.estado}>{String(convenioSeleccionado.estado || '').toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.tituloConvenio, { fontSize: 18, marginVertical: 10 }]}>
                        {convenioSeleccionado.titulo}
                    </Text>
                    <Text style={styles.detalleTexto}>📋 Tipo: {convenioSeleccionado.tipo || 'No especificado'}</Text>
                    <Text style={styles.detalleTexto}>⚖️ Marco Legal: {convenioSeleccionado.marco_legal || 'N/A'}</Text>
                    <Text style={styles.detalleTexto}>📝 Objeto: {convenioSeleccionado.objeto || 'Sin descripción'}</Text>
                    <Text style={styles.detalleTexto}>📅 Inicio: {String(convenioSeleccionado.fecha_inicio || '').slice(0, 10)}</Text>
                    <Text style={styles.detalleTexto}>⏳ Vencimiento: {String(convenioSeleccionado.fecha_vencimiento || '').slice(0, 10)}</Text>

                    <View style={{ marginTop: 15 }}>
                        <Boton 
                            titulo="📄 Descargar PDF del Convenio" 
                            onPress={() => descargarPDF(convenioSeleccionado)} 
                        />
                    </View>
                </View>
                <Boton titulo="Volver al listado" onPress={() => setConvenioSeleccionado(null)} secundario={true} />
            </ScrollView>
        );
    }

    // --- CÁLCULO DE PAGINACIÓN (10 CONVENIOS POR PÁGINA) ---
    const totalPaginas = Math.ceil(convenios.length / ITEMS_POR_PAGINA) || 1;
    const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const conveniosPaginados = convenios.slice(indiceInicio, indiceInicio + ITEMS_POR_PAGINA);

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

            {convenios.length > 0 && (
                <View style={styles.contenedorLista}>
                    <Text style={styles.subtituloLista}>
                        Convenios ({convenios.length}) - Página {paginaActual} de {totalPaginas}
                    </Text>

                    {conveniosPaginados.map((item, index) => (
                        <TouchableOpacity 
                            key={item.id || index} 
                            style={styles.itemConvenio}
                            onPress={() => verificarPermisoYAbrir(item)}
                        >
                            <View style={styles.filaSuperior}>
                                <Text style={styles.codigo}>{item.codigo_unico || `ID #${item.id}`}</Text>
                                <Text style={styles.estado}>{String(item.estado || '').toUpperCase()}</Text>
                            </View>
                            <Text style={styles.tituloConvenio}>{item.titulo}</Text>
                            {item.tipo && <Text style={styles.tipo}>Tipo: {item.tipo} (Tocá para abrir ficha y PDF)</Text>}
                        </TouchableOpacity>
                    ))}

                    {totalPaginas > 1 && (
                        <View style={styles.paginador}>
                            <TouchableOpacity 
                                style={[styles.botonPag, paginaActual === 1 && styles.botonPagDeshabilitado]}
                                disabled={paginaActual === 1}
                                onPress={() => setPaginaActual(paginaActual - 1)}
                            >
                                <Text style={styles.textoBotonPag}>◀ Anterior</Text>
                            </TouchableOpacity>

                            <Text style={styles.textoPagina}>{paginaActual} / {totalPaginas}</Text>

                            <TouchableOpacity 
                                style={[styles.botonPag, paginaActual === totalPaginas && styles.botonPagDeshabilitado]}
                                disabled={paginaActual === totalPaginas}
                                onPress={() => setPaginaActual(paginaActual + 1)}
                            >
                                <Text style={styles.textoBotonPag}>Siguiente ▶</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
    subtituloLista: { fontSize: 16, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
    itemConvenio: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#003366', elevation: 2 },
    filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    codigo: { fontSize: 12, fontWeight: 'bold', color: '#666' },
    estado: { fontSize: 11, fontWeight: 'bold', color: '#006633', backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    tituloConvenio: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 4 },
    tipo: { fontSize: 12, color: '#003366' },
    detalleTexto: { fontSize: 14, color: '#333', marginBottom: 8, lineHeight: 20 },
    paginador: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingVertical: 6 },
    botonPag: { backgroundColor: '#003366', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
    botonPagDeshabilitado: { backgroundColor: '#99aab5' },
    textoBotonPag: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    textoPagina: { fontWeight: 'bold', color: '#333' }
});