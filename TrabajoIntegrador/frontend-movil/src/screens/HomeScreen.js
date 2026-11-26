import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import Boton from '../components/atoms/Boton';
import FirmaPad from '../components/molecules/FirmaPad';
import BuscadorAvanzadoScreen from './BuscadorAvanzadoScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';

export default function HomeScreen({ irASostenibilidad, irAPerfil, irAQR, irAAyuda, codigoQR, limpiarQR, cerrarSesion }) {
  const { colors } = useAppColorScheme();
  const styles = createStyles(colors);

  const [mensajeSede, setMensajeSede] = useState('Buscando tu ubicación...');
  const [coordsActuales, setCoordsActuales] = useState(null);
  const [convenios, setConvenios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [esOffline, setEsOffline] = useState(false);

  // Navegación interna del Home
  const [busquedaHeader, setBusquedaHeader] = useState('');
  const [mostrarBuscadorAvanzado, setMostrarBuscadorAvanzado] = useState(false);
  const [tabActiva, setTabActiva] = useState('movimientos'); // 'movimientos' | 'pendientes'
  const [convenioSeleccionado, setConvenioSeleccionado] = useState(null);

  // Detalle del convenio seleccionado
  const [firmantes, setFirmantes] = useState([]);
  const [documentosConv, setDocumentosConv] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [comprobanteFirma, setComprobanteFirma] = useState(null);

  // Modal de Firma a mano + Huella
  const [modalFirmaVisible, setModalFirmaVisible] = useState(false);
  const [trazosFirma, setTrazosFirma] = useState([]);

  const IP_BACKEND = 'localhost';
  const PUERTO = '8000';
  const BASE_URL = `http://${IP_BACKEND}:${PUERTO}`;

  const filtrarPorRol = (listaCompleta, user) => {
    const rol = String(user?.rol || '').trim().toLowerCase();
    if (rol === 'consulta') {
      return listaCompleta.filter((c) => {
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

      // Cargamos caché offline primero y luego intentamos refrescar de la API
      const guardados = await AsyncStorage.getItem('@convenios_offline');
      if (guardados) {
        try {
          const parsed = JSON.parse(guardados);
          if (Array.isArray(parsed.lista)) {
            setConvenios(filtrarPorRol(parsed.lista, userObj));
          }
        } catch (e) {}
      }

      await traerConvenios(userObj);

      // Ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMensajeSede('Ubicación denegada.');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setCoordsActuales({
          lat: loc.coords.latitude.toFixed(6),
          lon: loc.coords.longitude.toFixed(6),
        });
        const distLat = Math.abs(loc.coords.latitude - -35.658);
        const distLon = Math.abs(loc.coords.longitude - -63.753);
        setMensajeSede(
          distLat < 0.05 && distLon < 0.05
            ? '📍 En Facu de Ingeniería (UNLPam)'
            : '📍 Fuera del campus'
        );
      } catch {
        setMensajeSede('Error obteniendo GPS.');
      }
    })();
  }, []);

  // Procesar QR escaneado
  useEffect(() => {
    if (!codigoQR) return;
    (async () => {
      let listaActual = convenios.length ? convenios : await traerConvenios();
      const qrLimpio = String(codigoQR).trim().toLowerCase();
      const encontrado = listaActual.find(
        (c) =>
          String(c.codigo_unico || '').toLowerCase() === qrLimpio ||
          qrLimpio.includes(String(c.codigo_unico || '').toLowerCase()) ||
          String(c.id) === qrLimpio
      );
      if (encontrado) {
        await abrirFichaConvenio(encontrado);
      } else {
        Alert.alert('No encontrado', `No se encontró el convenio (${codigoQR}).`);
      }
      limpiarQR?.();
    })();
  }, [codigoQR]);

  const traerConvenios = async (userParam = null) => {
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      if (!token) return [];

      const userObj = userParam || usuarioActual;
      const respuesta = await fetch(`${BASE_URL}/api/agreements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        const listaCruda = Array.isArray(data) ? data : data.data || data.convenios || [];
        const listaFiltrada = filtrarPorRol(listaCruda, userObj);
        setConvenios(listaFiltrada);
        setEsOffline(false);
        await AsyncStorage.setItem(
          '@convenios_offline',
          JSON.stringify({ ultimaVez: new Date().toLocaleTimeString(), lista: listaFiltrada })
        );
        return listaFiltrada;
      }
      return convenios;
    } catch {
      setEsOffline(true);
      setTabActiva('pendientes');
      return convenios;
    }
  };

  const abrirFichaConvenio = async (convenio) => {
    setConvenioSeleccionado(convenio);
    setFirmantes([]);
    setComentarios([]);
    setDocumentosConv(convenio.documentos || []);

    // Verificar si ya fue firmado desde la app (comprobante con lat/lon/fecha/hora)
    const compStr = await AsyncStorage.getItem(`@firma_comprobante_${convenio.id}`);
    setComprobanteFirma(compStr ? JSON.parse(compStr) : null);

    if (esOffline) return;

    const token = await AsyncStorage.getItem('@token_jwt');
    if (!token) return;

    // 1. Firmantes
    try {
      const rPartes = await fetch(`${BASE_URL}/api/parties/convenio/${convenio.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dPartes = await rPartes.json();
      if (rPartes.ok) setFirmantes(dPartes.data || []);
    } catch {}

    // 2. Documentos actualizados
    try {
      const rDocs = await fetch(`${BASE_URL}/api/documents/convenio/${convenio.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dDocs = await rDocs.json();
      if (rDocs.ok) setDocumentosConv(dDocs.documentos || []);
    } catch {}

    // 3. Comentarios
    try {
      const rCom = await fetch(`${BASE_URL}/api/agreements/${convenio.id}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dCom = await rCom.json();
      if (rCom.ok) setComentarios(dCom.data || []);
    } catch {}
  };

  // Descarga auxiliar para Leer (con zoom nativo) o Compartir (WSP/Email)
  const descargarArchivoLocal = async (doc) => {
    const token = await AsyncStorage.getItem('@token_jwt');
    const urlDescarga = `${BASE_URL}/api/documents/${doc.id}/download`;
    const nombreSeguro = String(doc.ruta_archivo || `doc_${doc.id}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const rutaDestino = `${FileSystem.documentDirectory}${nombreSeguro}`;
    const res = await FileSystem.downloadAsync(urlDescarga, rutaDestino, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status !== 200) throw new Error('Error descargando PDF');
    return res.uri;
  };

  const abrirPDFConZoom = async (doc) => {
    try {
      const uri = await descargarArchivoLocal(doc);
      const cUri = await FileSystem.getContentUriAsync(uri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: 'application/pdf',
      });
    } catch {
      Alert.alert('Error', 'No se pudo abrir el PDF.');
    }
  };

  const compartirPDF = async (doc) => {
    try {
      const disponible = await Sharing.isAvailableAsync();
      if (!disponible) return Alert.alert('Aviso', 'Compartir no está disponible en este dispositivo.');
      const uri = await descargarArchivoLocal(doc);
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir convenio (WhatsApp / Email)',
      });
    } catch {
      Alert.alert('Error', 'No se pudo compartir el documento.');
    }
  };

  const verMarcaMetadatos = async (doc) => {
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      const r = await fetch(`${BASE_URL}/api/documents/${doc.id}/metadata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (!r.ok) return Alert.alert('Sin metadatos', d.mensaje || 'No se pudo leer la marca.');

      const m = d.metadata;
      const detalleMarca = m.marca
        ? `Usuario ID: ${m.marca.usuario_id} (${m.marca.usuario_rol})\nConvenio ID: ${m.marca.id_convenio}\nFecha/Hora: ${m.marca.fecha_hora}\nOrigen: ${m.marca.origen}`
        : `Autor: ${m.autor}\nCreador: ${m.creador}`;

      Alert.alert(
        '🛡️ Marca de Verificación (Metadatos PDF)',
        `${detalleMarca}\n\nSHA-256: ${String(m.hash_sha256 || '').slice(0, 20)}...`
      );
    } catch {
      Alert.alert('Error', 'No se pudo consultar la marca del documento.');
    }
  };

  const subirPDFAnexo = async () => {
    if (esOffline) return Alert.alert('Modo Offline', 'No podés subir documentación sin conexión.');
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (resultado.canceled || !resultado.assets?.length) return;

      const archivo = resultado.assets[0];
      const token = await AsyncStorage.getItem('@token_jwt');

      const formData = new FormData();
      formData.append('archivo', {
        uri: archivo.uri,
        name: archivo.name || 'anexo.pdf',
        type: 'application/pdf',
      });
      formData.append('id_convenio', String(convenioSeleccionado.id));
      formData.append('tipo_documento', 'anexo');
      formData.append('origen', 'App Móvil Convenios UNLPam');

      const res = await fetch(`${BASE_URL}/api/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert('PDF Subido y Marcado', 'La API estampó los metadatos de verificación correctamente.');
        await abrirFichaConvenio(convenioSeleccionado);
      } else {
        Alert.alert('Error', data.mensaje || 'No se pudo subir el PDF.');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Fallo al seleccionar o subir el PDF.');
    }
  };

  const enviarComentario = async () => {
    if (esOffline) return Alert.alert('Modo Offline', 'No podés comentar sin conexión.');
    if (!nuevoComentario.trim()) return;
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      const res = await fetch(`${BASE_URL}/api/agreements/${convenioSeleccionado.id}/comentarios`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: nuevoComentario.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setNuevoComentario('');
        if (data.fueFiltrado) {
          Alert.alert('Moderación automática', 'Se detectó lenguaje inapropiado y se guardó como "comentario ofensivo".');
        }
        await abrirFichaConvenio(convenioSeleccionado);
      }
    } catch {
      Alert.alert('Error', 'No se pudo enviar el comentario.');
    }
  };

  // Firma completa: Firma a mano + Huella digital + GPS (lat/lon) + Fecha/Hora
  const confirmarFirmaCompleta = async () => {
    if (esOffline) return Alert.alert('Modo Offline', 'No se puede firmar sin conexión.');
    if (trazosFirma.length < 5) {
      return Alert.alert('Falta firma', 'Primero dibujá tu firma a mano en el recuadro.');
    }

    const bio = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirmar firma con Huella Digital',
      fallbackLabel: 'Usar PIN del dispositivo',
    });
    if (!bio.success) return Alert.alert('Cancelado', 'Se requiere validación biométrica para firmar.');

    let lat = coordsActuales?.lat || '-35.658000';
    let lon = coordsActuales?.lon || '-63.753000';
    try {
      const loc = await Location.getCurrentPositionAsync({});
      lat = loc.coords.latitude.toFixed(6);
      lon = loc.coords.longitude.toFixed(6);
    } catch {}

    const ahora = new Date();
    const fechaISO = ahora.toISOString().slice(0, 10);
    const horaStr = ahora.toLocaleTimeString();

    const token = await AsyncStorage.getItem('@token_jwt');
    const observacion = `Firmado desde App Móvil (Huella + Firma manuscrita) el ${fechaISO} ${horaStr} | Lat: ${lat}, Lon: ${lon}`;

    try {
      const res = await fetch(`${BASE_URL}/api/agreements/${convenioSeleccionado.id}/estado`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado_nuevo: 'firmado',
          fecha_firma: fechaISO,
          observacion,
          fecha_actualizacion_cliente: convenioSeleccionado.fecha_actualizacion_version,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const comp = { fecha: fechaISO, hora: horaStr, lat, lon, firmante: usuarioActual?.nombre_completo || 'Usuario' };
        await AsyncStorage.setItem(`@firma_comprobante_${convenioSeleccionado.id}`, JSON.stringify(comp));
        setComprobanteFirma(comp);
        setConvenioSeleccionado({ ...convenioSeleccionado, estado: 'firmado', fecha_firma: fechaISO });
        setModalFirmaVisible(false);
        setTrazosFirma([]);
        Alert.alert('✅ Convenio Firmado', `Fecha: ${fechaISO} ${horaStr}\nUbicación: ${lat}, ${lon}`);
        traerConvenios();
      } else {
        Alert.alert('No se pudo firmar', data.mensaje || 'Verificá permisos o estado del convenio.');
      }
    } catch {
      Alert.alert('Error', 'Error de red al registrar la firma.');
    }
  };

  // --- MÉTRICAS DEL DASHBOARD HOME ---
  const metricas = useMemo(() => {
    const haceUnAnio = new Date();
    haceUnAnio.setFullYear(haceUnAnio.getFullYear() - 1);
    const hoy = new Date();

    let firmadosUltimoAnio = 0;
    let vigentes = 0;
    let enTramite = 0;

    convenios.forEach((c) => {
      const est = String(c.estado || '').toLowerCase();
      if (est === 'firmado') {
        if (!c.fecha_firma || new Date(c.fecha_firma) >= haceUnAnio) firmadosUltimoAnio++;
        if (!c.fecha_vencimiento || new Date(c.fecha_vencimiento) >= hoy) vigentes++;
      } else if (['borrador', 'revision', 'aprobado'].includes(est)) {
        enTramite++;
      }
    });
    return { firmadosUltimoAnio, vigentes, enTramite };
  }, [convenios]);

  // Últimos 10 movimientos (más reciente a más antiguo)
  const ultimosMovimientos = useMemo(() => {
    return [...convenios]
      .sort((a, b) => new Date(b.fecha_actualizacion || 0) - new Date(a.fecha_actualizacion || 0))
      .slice(0, 10);
  }, [convenios]);

  // Mis Pendientes por firmar (estado aprobado, máx 10, más reciente a más antiguo)
  const misPendientes = useMemo(() => {
    return [...convenios]
      .filter((c) => String(c.estado || '').toLowerCase() === 'aprobado')
      .sort((a, b) => new Date(b.fecha_actualizacion || 0) - new Date(a.fecha_actualizacion || 0))
      .slice(0, 10);
  }, [convenios]);

  const listaVisible = useMemo(() => {
    const base = esOffline ? misPendientes : tabActiva === 'pendientes' ? misPendientes : ultimosMovimientos;
    const q = busquedaHeader.trim().toLowerCase();
    if (!q || esOffline) return base;
    return convenios.filter(
      (c) =>
        String(c.titulo || '').toLowerCase().includes(q) ||
        String(c.codigo_unico || '').toLowerCase().includes(q)
    );
  }, [esOffline, tabActiva, misPendientes, ultimosMovimientos, busquedaHeader, convenios]);

  // --- PANTALLA BUSCADOR AVANZADO ---
  if (mostrarBuscadorAvanzado) {
    return (
      <BuscadorAvanzadoScreen
        convenios={convenios}
        esOffline={esOffline}
        alSeleccionar={(c) => {
          setMostrarBuscadorAvanzado(false);
          abrirFichaConvenio(c);
        }}
        alCerrar={() => setMostrarBuscadorAvanzado(false)}
      />
    );
  }

  // --- PANTALLA FICHA / FIRMADOR DE CONVENIO ---
  if (convenioSeleccionado) {
    const padre = convenios.find((c) => Number(c.id) === Number(convenioSeleccionado.id_antecedente));
    const estaFirmado = String(convenioSeleccionado.estado || '').toLowerCase() === 'firmado';
    const puedeFirmar = String(convenioSeleccionado.estado || '').toLowerCase() === 'aprobado';

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Firmador y Ficha del Convenio</Text>

        <View style={styles.tarjeta}>
          <View style={styles.filaSuperior}>
            <Text style={styles.codigo}>{convenioSeleccionado.codigo_unico || `ID #${convenioSeleccionado.id}`}</Text>
            <Text style={styles.estado}>{String(convenioSeleccionado.estado || '').toUpperCase()}</Text>
          </View>
          <Text style={[styles.tituloConvenio, { fontSize: 18, marginVertical: 8 }]}>
            {convenioSeleccionado.titulo}
          </Text>
          <Text style={styles.detalleTexto}>🏛️ Procedencia (Unidad): #{convenioSeleccionado.id_unidad_responsable || 'N/A'}</Text>
          <Text style={styles.detalleTexto}>📋 Tipo: {convenioSeleccionado.tipo || 'No especificado'}</Text>
          <Text style={styles.detalleTexto}>⚖️ Marco Legal: {convenioSeleccionado.marco_legal || 'N/A'}</Text>
          <Text style={styles.detalleTexto}>📜 Resolución: {convenioSeleccionado.resolucion || 'Sin resolución'}</Text>
          <Text style={styles.detalleTexto}>
            🔗 Convenio Padre: {padre ? `${padre.codigo_unico} - ${padre.titulo}` : 'Ninguno (Convenio raíz)'}
          </Text>
          <Text style={styles.detalleTexto}>
            📅 Inicio: {String(convenioSeleccionado.fecha_inicio || '').slice(0, 10) || '-'} | Vencimiento:{' '}
            {String(convenioSeleccionado.fecha_vencimiento || '').slice(0, 10) || '-'}
          </Text>

          <Text style={[styles.subtitulo, { marginTop: 10 }]}>✍️ Firmantes:</Text>
          {firmantes.length === 0 ? (
            <Text style={styles.detalleTexto}>• Sin partes registradas o modo offline.</Text>
          ) : (
            firmantes.map((f) => (
              <Text key={f.id} style={styles.detalleTexto}>
                • {f.nombre} (Rep: {f.representante})
              </Text>
            ))
          )}
        </View>

        {/* Comprobante de documento firmado */}
        {(estaFirmado || comprobanteFirma) && (
          <View style={[styles.tarjeta, { borderColor: colors.positive, borderWidth: 2 }]}>
            <Text style={[styles.subtitulo, { color: colors.positive }]}>✅ DOCUMENTO FIRMADO</Text>
            <Text style={styles.detalleTexto}>
              Fecha: {comprobanteFirma?.fecha || String(convenioSeleccionado.fecha_firma || '').slice(0, 10)}
              {comprobanteFirma?.hora ? ` - Hora: ${comprobanteFirma.hora}` : ''}
            </Text>
            {comprobanteFirma && (
              <Text style={styles.detalleTexto}>
                📍 Lat: {comprobanteFirma.lat} | Lon: {comprobanteFirma.lon}
              </Text>
            )}
          </View>
        )}

        {/* Documentación PDF */}
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>📄 Documentación PDF</Text>
          {documentosConv.length === 0 ? (
            <Text style={styles.detalleTexto}>No hay archivos PDF adjuntos.</Text>
          ) : (
            documentosConv.map((doc) => (
              <View key={doc.id} style={styles.docItem}>
                <Text style={styles.detalleTexto}>
                  {doc.tipo_documento?.toUpperCase()}: {doc.ruta_archivo}
                </Text>
                <View style={styles.filaBotonesDoc}>
                  <TouchableOpacity style={styles.btnChico} onPress={() => abrirPDFConZoom(doc)}>
                    <Text style={styles.txtBtnChico}>🔍 Leer (Zoom)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnChico} onPress={() => compartirPDF(doc)}>
                    <Text style={styles.txtBtnChico}>📤 Compartir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnChico} onPress={() => verMarcaMetadatos(doc)}>
                    <Text style={styles.txtBtnChico}>🛡️ Marca</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <Boton titulo="📎 Subir PDF Anexo (con Marca API)" onPress={subirPDFAnexo} secundario={true} />
        </View>

        {/* Botón Firmar al final */}
        {puedeFirmar && !estaFirmado && (
          <Boton
            titulo="✍️ Firmar Convenio (Firma + Huella)"
            onPress={() =>
              esOffline
                ? Alert.alert('Modo Offline', 'La firma no está disponible sin conexión.')
                : setModalFirmaVisible(true)
            }
          />
        )}

        {/* Comentarios */}
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>💬 Comentarios ({comentarios.length})</Text>
          {esOffline ? (
            <Text style={styles.detalleTexto}>📡 Estás offline. Comentarios deshabilitados.</Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Escribí un comentario..."
                placeholderTextColor={colors.textSecondary}
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
              />
              <Boton titulo="Enviar comentario" onPress={enviarComentario} />
              {comentarios.map((c) => (
                <View key={c.id} style={styles.comentarioItem}>
                  <Text style={styles.comentarioAutor}>{c.usuario}</Text>
                  <Text style={styles.detalleTexto}>{c.texto}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        <Boton titulo="Volver al Panel" onPress={() => setConvenioSeleccionado(null)} secundario={true} />

        {/* MODAL DE FIRMA MANUSCRITA + HUELLA */}
        <Modal visible={modalFirmaVisible} animationType="slide" transparent={true}>
          <View style={styles.modalFondo}>
            <View style={[styles.modalContenido, { backgroundColor: colors.backgroundElement }]}>
              <Text style={styles.titulo}>Acto de Firma</Text>
              <FirmaPad onCambioFirma={setTrazosFirma} colores={colors} />
              <Boton titulo="Confirmar con Huella Digital" onPress={confirmarFirmaCompleta} />
              <Boton titulo="Cancelar" onPress={() => setModalFirmaVisible(false)} secundario={true} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  // --- PANTALLA PRINCIPAL HOME ---
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header con Buscador rápido */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Panel de Convenios</Text>
        <Text style={styles.textoUbicacion}>
          {esOffline ? '📡 MODO OFFLINE (Solo pendientes)' : mensajeSede}
        </Text>
        <View style={styles.filaBuscador}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder={esOffline ? 'Buscador deshabilitado (Offline)' : 'Buscar convenio rápido...'}
            placeholderTextColor={colors.textSecondary}
            editable={!esOffline}
            value={busquedaHeader}
            onChangeText={setBusquedaHeader}
          />
          <TouchableOpacity
            style={styles.btnAvanzado}
            onPress={() => setMostrarBuscadorAvanzado(true)}
          >
            <Text style={styles.txtBtnChico}>🌳 Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Boxes de Resumen */}
      <View style={styles.gridBoxes}>
        <View style={styles.boxMetric}>
          <Text style={styles.boxNumero}>{metricas.firmadosUltimoAnio}</Text>
          <Text style={styles.boxLabel}>Firmados último año</Text>
        </View>
        <View style={styles.boxMetric}>
          <Text style={styles.boxNumero}>{metricas.vigentes}</Text>
          <Text style={styles.boxLabel}>Vigentes</Text>
        </View>
        <View style={styles.boxMetric}>
          <Text style={styles.boxNumero}>{metricas.enTramite}</Text>
          <Text style={styles.boxLabel}>En trámite</Text>
        </View>
        <View style={styles.boxMetric}>
          <Text style={[styles.boxNumero, { color: '#d35400' }]}>{misPendientes.length}</Text>
          <Text style={styles.boxLabel}>Por firmar</Text>
        </View>
      </View>

      {/* Selector de listado: Últimos movimientos vs Mis Pendientes */}
      <View style={styles.filaTabs}>
        <TouchableOpacity
          style={[styles.tab, tabActiva === 'movimientos' && !esOffline && styles.tabActiva]}
          disabled={esOffline}
          onPress={() => setTabActiva('movimientos')}
        >
          <Text style={styles.tabTexto}>Últimos 10 Movimientos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, (tabActiva === 'pendientes' || esOffline) && styles.tabActiva]}
          onPress={() => setTabActiva('pendientes')}
        >
          <Text style={styles.tabTexto}>Mis Pendientes ({misPendientes.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Listado */}
      {listaVisible.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.itemConvenio}
          onPress={() => abrirFichaConvenio(item)}
        >
          <View style={styles.filaSuperior}>
            <Text style={styles.codigo}>{item.codigo_unico || `ID #${item.id}`}</Text>
            <Text style={styles.estado}>{String(item.estado || '').toUpperCase()}</Text>
          </View>
          <Text style={styles.tituloConvenio}>{item.titulo}</Text>
          <Text style={styles.tipo}>Tocá para leer PDF, comentar o firmar</Text>
        </TouchableOpacity>
      ))}

      <View style={{ marginTop: 10 }}>
        <Boton titulo="🔄 Actualizar Convenios" onPress={() => traerConvenios()} />
        <Boton titulo="📷 Escanear Código QR" onPress={irAQR} />
        <Boton titulo="👤 Mi Perfil e Identidad" onPress={irAPerfil} secundario={true} />
        <Boton titulo="🔔 Notificaciones y Manual" onPress={irAAyuda} secundario={true} />
        <Boton titulo="🌱 Impacto y Sostenibilidad" onPress={irASostenibilidad} secundario={true} />
        {cerrarSesion && <Boton titulo="Cerrar Sesión" onPress={cerrarSesion} secundario={true} />}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: colors.background },
    header: { marginBottom: 14 },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: colors.accent, marginBottom: 6 },
    textoUbicacion: { fontSize: 13, textAlign: 'center', color: colors.textSecondary, marginBottom: 10 },
    filaBuscador: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    btnAvanzado: { backgroundColor: colors.accent, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 8 },
    gridBoxes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 14 },
    boxMetric: {
      width: '48%',
      backgroundColor: colors.backgroundElement,
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    boxNumero: { fontSize: 24, fontWeight: 'bold', color: colors.accent },
    boxLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
    filaTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.backgroundElement,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabActiva: { borderColor: colors.accent, borderWidth: 2 },
    tabTexto: { fontSize: 12, fontWeight: 'bold', color: colors.text },
    tarjeta: {
      backgroundColor: colors.backgroundElement,
      padding: 14,
      borderRadius: 10,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    subtitulo: { fontSize: 15, fontWeight: 'bold', color: colors.accent, marginBottom: 8 },
    itemConvenio: {
      backgroundColor: colors.backgroundElement,
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
    },
    filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    codigo: { fontSize: 12, fontWeight: 'bold', color: colors.textSecondary },
    estado: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.positive,
      backgroundColor: colors.positiveBackground,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    tituloConvenio: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
    tipo: { fontSize: 12, color: colors.accent },
    detalleTexto: { fontSize: 13, color: colors.text, marginBottom: 5, lineHeight: 19 },
    docItem: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginBottom: 10 },
    filaBotonesDoc: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
    btnChico: { backgroundColor: colors.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    txtBtnChico: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    input: {
      backgroundColor: colors.background,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
    },
    comentarioItem: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6, marginTop: 6 },
    comentarioAutor: { fontSize: 12, fontWeight: 'bold', color: colors.accent },
    modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
    modalContenido: { borderRadius: 12, padding: 18 },
  });