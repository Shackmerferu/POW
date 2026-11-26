import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
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
import { useNavigation } from 'expo-router';

import Boton from '../components/atoms/Boton';
import HeaderApp from '../components/molecules/HeaderApp';
import Paginador from '../components/molecules/Paginador';
import FirmaPad from '../components/molecules/FirmaPad';
import BuscadorAvanzadoScreen from './BuscadorAvanzadoScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { API_BASE_URL } from '../constants/api';
import { createStyles } from '../styles/HomeScreen.styles';

const etiquetaEstado = (estado) => ({
  aprobado: 'Listo para firmar',
  firmado: 'Firmado',
  revision: 'En revisión',
  borrador: 'Borrador',
  archivado: 'Archivado',
  rescindido: 'Rescindido',
}[String(estado || '').toLowerCase()] || 'Estado no disponible');

const fechaLegible = (valor) => {
  if (!valor) return 'Fecha no disponible';
  const fecha = new Date(String(valor).replace(' ', 'T'));
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return `${fecha.toLocaleDateString('es-AR')} · ${fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const tituloMovimiento = (movimiento) => {
  const anterior = String(movimiento.estado_previo || '').toLowerCase();
  const nuevo = String(movimiento.estado_nuevo || '').toLowerCase();
  if (anterior && nuevo) return `${etiquetaEstado(anterior)} → ${etiquetaEstado(nuevo)}`;
  if (nuevo) return `Convenio registrado · ${etiquetaEstado(nuevo)}`;

  const observacion = String(movimiento.observacion || '');
  if (/subid|cargad|adjunt/i.test(observacion)) return 'Documento adjuntado';
  if (/vista previa|descarg/i.test(observacion)) return 'Documento consultado';
  return 'Actividad del convenio';
};

const ELEMENTOS_POR_PAGINA = 10;

export default function HomeScreen({ irANotificaciones, irAManual, codigoQR, limpiarQR, cerrarSesion }) {
  const { colors } = useAppColorScheme();
  const { escala } = useFontScale();
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(colors, escala), [colors, escala]);

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
  const [paginaConvenios, setPaginaConvenios] = useState(1);

  // Detalle del convenio seleccionado
  const [firmantes, setFirmantes] = useState([]);
  const [documentosConv, setDocumentosConv] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [comprobanteFirma, setComprobanteFirma] = useState(null);
  const [historialConvenio, setHistorialConvenio] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState('');
  const [paginaAuditoria, setPaginaAuditoria] = useState(1);
  const actualizarAutomaticamenteRef = useRef(null);

  // Modal de Firma a mano + Huella
  const [modalFirmaVisible, setModalFirmaVisible] = useState(false);
  const [trazosFirma, setTrazosFirma] = useState([]);

  const renderHeaderApp = () => (
    <HeaderApp
      alCerrarSesion={cerrarSesion}
      alAbrirNotificaciones={irANotificaciones}
    />
  );

  // Al tocar la pestaña Convenios volvemos siempre al listado principal.
  useEffect(() => {
    const volverAlListado = () => {
      setConvenioSeleccionado(null);
      setMostrarBuscadorAvanzado(false);
      setTabActiva('movimientos');
      setBusquedaHeader('');
      setPaginaConvenios(1);
      setPaginaAuditoria(1);
    };
    const unsubscribe = navigation.addListener('tabPress', volverAlListado);
    return unsubscribe;
  }, [navigation]);

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
        } catch {}
      }

      // Cargamos caché offline primero y luego intentamos refrescar de la API
      const guardados = await AsyncStorage.getItem('@convenios_offline');
      if (guardados) {
        try {
          const parsed = JSON.parse(guardados);
          if (Array.isArray(parsed.lista)) {
            setConvenios(filtrarPorRol(parsed.lista, userObj));
          }
        } catch {}
      }

      // eslint-disable-next-line react-hooks/immutability
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
      const encontrado = listaActual.find((c) => {
        const cod = String(c.codigo_unico || '').trim().toLowerCase();
        return (
          (cod !== '' && (cod === qrLimpio || qrLimpio.includes(cod))) ||
          String(c.id) === qrLimpio
        );
      });
      if (encontrado) {
        // eslint-disable-next-line react-hooks/immutability
        await abrirFichaConvenio(encontrado);
      } else {
        Alert.alert('No encontramos el convenio', 'Revisá que el código sea correcto e intentá escanearlo nuevamente.');
      }
      limpiarQR?.();
    })();
  }, [codigoQR]);

  const traerConvenios = async (userParam = null) => {
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      if (!token) return [];

      const userObj = userParam || usuarioActual;
      const respuesta = await fetch(`${API_BASE_URL}/api/agreements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        const listaCruda = Array.isArray(data) ? data : data.data || data.convenios || [];
        const listaFiltrada = filtrarPorRol(listaCruda, userObj);
        setConvenios(listaFiltrada);
        setConvenioSeleccionado((actual) => {
          if (!actual) return actual;
          return listaFiltrada.find((item) => Number(item.id) === Number(actual.id)) || actual;
        });
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

  const cargarHistorialConvenio = async (idConvenio, tokenSesion = null) => {
    if (!idConvenio || esOffline || cargandoHistorial) return;

    setCargandoHistorial(true);
    setErrorHistorial('');
    try {
      const token = tokenSesion || await AsyncStorage.getItem('@token_jwt');
      if (!token) throw new Error('No hay una sesión activa.');

      const respuesta = await fetch(`${API_BASE_URL}/api/agreements/${idConvenio}/auditoria`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await respuesta.json();
      if (!respuesta.ok) throw new Error(data.mensaje || 'No se pudo cargar el seguimiento.');

      const movimientos = Array.isArray(data.data) ? data.data : [];
      setHistorialConvenio(movimientos);
      await AsyncStorage.setItem(`@auditoria_convenio_${idConvenio}`, JSON.stringify(movimientos));
    } catch {
      setErrorHistorial('No pudimos actualizar el seguimiento. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setCargandoHistorial(false);
    }
  };

  const abrirFichaConvenio = async (convenio) => {
    setPaginaAuditoria(1);
    setConvenioSeleccionado(convenio);
    setFirmantes([]);
    setComentarios([]);
    setDocumentosConv(convenio.documentos || []);
    setHistorialConvenio([]);
    setErrorHistorial('');

    const historialGuardado = await AsyncStorage.getItem(`@auditoria_convenio_${convenio.id}`);
    if (historialGuardado) {
      try {
        const historial = JSON.parse(historialGuardado);
        if (Array.isArray(historial)) setHistorialConvenio(historial);
      } catch {}
    }

    // Verificar si ya fue firmado desde la app (comprobante con lat/lon/fecha/hora)
    const compStr = await AsyncStorage.getItem(`@firma_comprobante_${convenio.id}`);
    setComprobanteFirma(compStr ? JSON.parse(compStr) : null);

    if (esOffline) return;

    const token = await AsyncStorage.getItem('@token_jwt');
    if (!token) return;

    await cargarHistorialConvenio(convenio.id, token);

    // 1. Firmantes
    try {
      const rPartes = await fetch(`${API_BASE_URL}/api/parties/convenio/${convenio.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dPartes = await rPartes.json();
      if (rPartes.ok) setFirmantes(dPartes.data || []);
    } catch {}

    // 2. Documentos actualizados
    try {
      const rDocs = await fetch(`${API_BASE_URL}/api/documents/convenio/${convenio.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dDocs = await rDocs.json();
      if (rDocs.ok) setDocumentosConv(dDocs.documentos || []);
    } catch {}

    // 3. Comentarios
    try {
      const rCom = await fetch(`${API_BASE_URL}/api/agreements/${convenio.id}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dCom = await rCom.json();
      if (rCom.ok) setComentarios(dCom.data || []);
    } catch {}
  };

  // Descarga auxiliar para Leer (con zoom nativo) o Compartir (WSP/Email)
  const descargarArchivoLocal = async (doc) => {
    const token = await AsyncStorage.getItem('@token_jwt');
    const urlDescarga = `${API_BASE_URL}/api/documents/${doc.id}/download`;
    const nombreSeguro = String(doc.ruta_archivo || `doc_${doc.id}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const rutaDestino = `${FileSystem.documentDirectory}${nombreSeguro}`;
    const res = await FileSystem.downloadAsync(urlDescarga, rutaDestino, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status !== 200) throw new Error('No se pudo descargar el documento');
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
      Alert.alert('No pudimos abrir el documento', 'Intentá de nuevo en unos momentos.');
    }
  };

  const compartirPDF = async (doc) => {
    try {
      const disponible = await Sharing.isAvailableAsync();
      if (!disponible) return Alert.alert('No disponible', 'Este dispositivo no permite compartir archivos desde la app.');
      const uri = await descargarArchivoLocal(doc);
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir documento del convenio',
      });
    } catch {
      Alert.alert('No pudimos compartir el documento', 'Intentá de nuevo en unos momentos.');
    }
  };

  const verMarcaMetadatos = async (doc) => {
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      const r = await fetch(`${API_BASE_URL}/api/documents/${doc.id}/metadata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (!r.ok) return Alert.alert('No hay información de verificación', d.mensaje || 'No pudimos consultar quién subió el documento y cuándo.');

      const m = d.metadata;
      const detalleMarca = m.marca
        ? `Subido por: ${m.marca.usuario_rol}\nConvenio: ${m.marca.id_convenio}\nFecha y hora: ${m.marca.fecha_hora}\nOrigen: ${m.marca.origen}`
        : `Autor: ${m.autor}\nCreador: ${m.creador}`;

      Alert.alert(
        'Información de verificación del documento',
        `${detalleMarca}\n\nCódigo de integridad: ${String(m.hash_sha256 || '').slice(0, 20)}...`
      );
    } catch {
        Alert.alert('No pudimos verificar el documento', 'Intentá de nuevo en unos momentos.');
    }
  };

  const subirPDFAnexo = async () => {
    if (esOffline) return Alert.alert('Sin conexión', 'Conectate a internet para adjuntar un documento.');
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

      const res = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert('Documento adjuntado', 'El archivo se agregó al convenio y quedó registrada la información de verificación.');
        await abrirFichaConvenio(convenioSeleccionado);
      } else {
        Alert.alert('No pudimos adjuntar el documento', data.mensaje || 'Intentá de nuevo en unos momentos.');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('No pudimos adjuntar el documento', 'Elegí un archivo PDF e intentá nuevamente.');
    }
  };

  const enviarComentario = async () => {
    if (esOffline) return Alert.alert('Sin conexión', 'Conectate a internet para agregar un comentario.');
    if (!nuevoComentario.trim()) return;
    try {
      const token = await AsyncStorage.getItem('@token_jwt');
      const res = await fetch(`${API_BASE_URL}/api/agreements/${convenioSeleccionado.id}/comentarios`, {
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
          Alert.alert('Comentario revisado', 'El comentario se guardó como “comentario ofensivo” porque contiene lenguaje inapropiado.');
        }
        await abrirFichaConvenio(convenioSeleccionado);
      }
    } catch {
      Alert.alert('No pudimos enviar el comentario', 'Revisá tu conexión e intentá nuevamente.');
    }
  };

  // Firma completa: Firma a mano + Huella digital + GPS (lat/lon) + Fecha/Hora
  const confirmarFirmaCompleta = async () => {
    if (esOffline) return Alert.alert('Sin conexión', 'Conectate a internet para firmar el convenio.');
    if (trazosFirma.length < 5) {
      return Alert.alert('Falta tu firma', 'Firmá dentro del recuadro antes de continuar.');
    }

    const bio = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirmá tu identidad para firmar',
      fallbackLabel: 'Usar código del dispositivo',
    });
    if (!bio.success) return Alert.alert('No se confirmó tu identidad', 'Necesitamos validar tu identidad para registrar la firma.');

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
      const res = await fetch(`${API_BASE_URL}/api/agreements/${convenioSeleccionado.id}/estado`, {
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
        Alert.alert('Convenio firmado', `Fecha: ${fechaISO} ${horaStr}\nUbicación: ${lat}, ${lon}`);
        await cargarHistorialConvenio(convenioSeleccionado.id);
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

  // Convenios ordenados por actualización reciente (máximo 10 movimientos).
  const ultimosMovimientos = useMemo(() => {
    return [...convenios]
      .sort((a, b) => new Date(b.fecha_actualizacion || 0) - new Date(a.fecha_actualizacion || 0))
      .slice(0, 10);
  }, [convenios]);

  // Todos los pendientes de firma, ordenados por actualización reciente.
  const misPendientes = useMemo(() => {
    return [...convenios]
      .filter((c) => String(c.estado || '').toLowerCase() === 'aprobado')
      .sort((a, b) => new Date(b.fecha_actualizacion || 0) - new Date(a.fecha_actualizacion || 0));
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

  const totalPaginasConvenios = Math.ceil(listaVisible.length / ELEMENTOS_POR_PAGINA);
  const paginaConveniosActual = Math.min(paginaConvenios, Math.max(totalPaginasConvenios, 1));
  const conveniosPaginados = listaVisible.slice(
    (paginaConveniosActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaConveniosActual * ELEMENTOS_POR_PAGINA
  );
  const totalPaginasAuditoria = Math.ceil(historialConvenio.length / ELEMENTOS_POR_PAGINA);
  const paginaAuditoriaActual = Math.min(paginaAuditoria, Math.max(totalPaginasAuditoria, 1));
  const historialPaginado = historialConvenio.slice(
    (paginaAuditoriaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaAuditoriaActual * ELEMENTOS_POR_PAGINA
  );

  useEffect(() => {
    actualizarAutomaticamenteRef.current = async () => {
      await traerConvenios();
      if (convenioSeleccionado && !esOffline) {
        await cargarHistorialConvenio(convenioSeleccionado.id);
      }
    };
  }, [traerConvenios, cargarHistorialConvenio, convenioSeleccionado, esOffline]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      void actualizarAutomaticamenteRef.current?.();
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  // --- PANTALLA BUSCADOR AVANZADO ---
  if (mostrarBuscadorAvanzado) {
    return (
      <View style={styles.pantallaHome}>
        {renderHeaderApp()}
        <View style={{ flex: 1 }}>
          <BuscadorAvanzadoScreen
            convenios={convenios}
            esOffline={esOffline}
            alSeleccionar={(c) => {
              setMostrarBuscadorAvanzado(false);
              abrirFichaConvenio(c);
            }}
          />
        </View>
      </View>
    );
  }

  // --- PANTALLA FICHA / FIRMADOR DE CONVENIO ---
  if (convenioSeleccionado) {
    const padre = convenios.find((c) => Number(c.id) === Number(convenioSeleccionado.id_antecedente));
    const estaFirmado = String(convenioSeleccionado.estado || '').toLowerCase() === 'firmado';
    const puedeFirmar = String(convenioSeleccionado.estado || '').toLowerCase() === 'aprobado';

    return (
      <View style={styles.pantallaHome}>
      {renderHeaderApp()}
      <ScrollView style={styles.scrollHome} contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Detalles del convenio</Text>

        <View style={styles.tarjeta}>
          <View style={styles.filaSuperior}>
            <Text style={styles.codigo}>{convenioSeleccionado.codigo_unico || `N.º ${convenioSeleccionado.id}`}</Text>
            <Text style={styles.estado}>{etiquetaEstado(convenioSeleccionado.estado)}</Text>
          </View>
          <Text style={[styles.tituloConvenio, { fontSize: 18, marginVertical: 8 }]}>
            {convenioSeleccionado.titulo}
          </Text>
          <Text style={styles.detalleTexto}>🏛️ Unidad responsable: {convenioSeleccionado.id_unidad_responsable || 'No especificada'}</Text>
          <Text style={styles.detalleTexto}>📋 Tipo: {convenioSeleccionado.tipo || 'No especificado'}</Text>
          <Text style={styles.detalleTexto}>⚖️ Marco legal: {convenioSeleccionado.marco_legal || 'No especificado'}</Text>
          <Text style={styles.detalleTexto}>📜 Resolución: {convenioSeleccionado.resolucion || 'Sin resolución asociada'}</Text>
          <Text style={styles.detalleTexto}>
            🔗 Convenio relacionado: {padre ? `${padre.codigo_unico} - ${padre.titulo}` : 'Este convenio no depende de otro'}
          </Text>
          <Text style={styles.detalleTexto}>
            📅 Inicio: {String(convenioSeleccionado.fecha_inicio || '').slice(0, 10) || '-'} | Vencimiento:{' '}
            {String(convenioSeleccionado.fecha_vencimiento || '').slice(0, 10) || '-'}
          </Text>

          <Text style={[styles.subtitulo, { marginTop: 10 }]}>✍️ Personas que firman</Text>
          {firmantes.length === 0 ? (
            <Text style={styles.detalleTexto}>Todavía no hay personas firmantes registradas.</Text>
          ) : (
            firmantes.map((f) => (
              <Text key={f.id} style={styles.detalleTexto}>
                • {f.nombre}{f.representante ? ` · Representante: ${f.representante}` : ''}
              </Text>
            ))
          )}
        </View>

        <View style={styles.tarjeta}>
          <View style={styles.historialEncabezado}>
            <Text style={styles.subtitulo}>Seguimiento del convenio</Text>
          </View>
          <Text style={styles.detalleTexto}>
            Estado actual: {etiquetaEstado(convenioSeleccionado.estado)}
          </Text>
          <Text style={styles.historialFecha}>
            Actualización automática cada 30 segundos mientras consultás el convenio.
          </Text>

          {errorHistorial ? <Text style={styles.historialAviso}>{errorHistorial}</Text> : null}
          {esOffline && historialConvenio.length === 0 ? (
            <Text style={styles.historialAviso}>El seguimiento estará disponible cuando vuelvas a conectarte.</Text>
          ) : historialConvenio.length === 0 && !cargandoHistorial && !errorHistorial ? (
            <Text style={styles.detalleTexto}>Todavía no hay movimientos registrados para este convenio.</Text>
          ) : null}

          {historialPaginado.map((movimiento, indice) => (
            <View key={movimiento.id || `${movimiento.fecha_registro}-${indice}`} style={styles.historialFila}>
              <View style={styles.historialColumna}>
                <View
                  style={[
                    styles.historialPunto,
                    String(movimiento.estado_nuevo || '').toLowerCase() === 'firmado' && styles.historialPuntoFinal,
                  ]}
                />
                {indice < historialPaginado.length - 1 && <View style={styles.historialLinea} />}
              </View>
              <View style={styles.historialContenido}>
                <Text style={styles.historialFecha}>{fechaLegible(movimiento.fecha_registro)}</Text>
                <Text style={styles.historialTitulo}>{tituloMovimiento(movimiento)}</Text>
                <Text style={styles.historialResponsable}>
                  Responsable: {movimiento.nombre_completo || 'Usuario'}
                </Text>
                {movimiento.observacion ? (
                  <Text style={styles.historialObservacion}>{movimiento.observacion}</Text>
                ) : null}
              </View>
            </View>
          ))}
          {historialConvenio.length > 0 && (
            <Text style={styles.historialFecha}>
              Mostrando {historialPaginado.length} de {historialConvenio.length} cambios.
            </Text>
          )}
          <Paginador
            pagina={paginaAuditoriaActual}
            totalPaginas={totalPaginasAuditoria}
            alCambiar={setPaginaAuditoria}
          />
        </View>

        {/* Comprobante de documento firmado */}
        {(estaFirmado || comprobanteFirma) && (
          <View style={[styles.tarjeta, { borderColor: colors.positive, borderWidth: 2 }]}>
            <Text style={[styles.subtitulo, { color: colors.positive }]}>✅ Convenio firmado</Text>
            <Text style={styles.detalleTexto}>
              Fecha: {comprobanteFirma?.fecha || String(convenioSeleccionado.fecha_firma || '').slice(0, 10)}
              {comprobanteFirma?.hora ? ` - Hora: ${comprobanteFirma.hora}` : ''}
            </Text>
            {comprobanteFirma && (
              <Text style={styles.detalleTexto}>
              📍 Ubicación de la firma: {comprobanteFirma.lat}, {comprobanteFirma.lon}
              </Text>
            )}
          </View>
        )}

        {/* Documentación PDF */}
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>📄 Documentos del convenio</Text>
          {documentosConv.length === 0 ? (
            <Text style={styles.detalleTexto}>Este convenio todavía no tiene documentos adjuntos.</Text>
          ) : (
            documentosConv.map((doc) => (
              <View key={doc.id} style={styles.docItem}>
                <Text style={styles.detalleTexto}>
                  {doc.tipo_documento?.toUpperCase()}: {doc.ruta_archivo}
                </Text>
                <View style={styles.filaBotonesDoc}>
                  <TouchableOpacity style={styles.btnChico} onPress={() => abrirPDFConZoom(doc)}>
                    <Text style={styles.txtBtnChico}>Abrir documento</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnChico} onPress={() => compartirPDF(doc)}>
                    <Text style={styles.txtBtnChico}>📤 Compartir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnChico} onPress={() => verMarcaMetadatos(doc)}>
                    <Text style={styles.txtBtnChico}>Verificación</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <Boton titulo="Adjuntar documento PDF" onPress={subirPDFAnexo} secundario={true} />
        </View>

        {/* Botón Firmar al final */}
        {puedeFirmar && !estaFirmado && (
          <Boton
            titulo="Firmar convenio"
            onPress={() =>
              esOffline
                ? Alert.alert('Sin conexión', 'Conectate a internet para firmar el convenio.')
                : setModalFirmaVisible(true)
            }
          />
        )}

        {/* Comentarios */}
        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>💬 Comentarios ({comentarios.length})</Text>
          {esOffline ? (
          <Text style={styles.detalleTexto}>Conectate a internet para ver y agregar comentarios.</Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Escribí tu comentario"
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

        {/* MODAL DE FIRMA MANUSCRITA + HUELLA */}
        <Modal visible={modalFirmaVisible} animationType="slide" transparent={true}>
          <View style={styles.modalFondo}>
            <View style={[styles.modalContenido, { backgroundColor: colors.backgroundElement }]}>
              <Text style={styles.titulo}>Confirmar firma</Text>
              <FirmaPad onCambioFirma={setTrazosFirma} colores={colors} />
              <Boton titulo="Confirmar mi identidad y firmar" onPress={confirmarFirmaCompleta} />
              <Boton titulo="Cancelar" onPress={() => setModalFirmaVisible(false)} secundario={true} />
            </View>
          </View>
        </Modal>
      </ScrollView>
      </View>
    );
  }

  // --- PANTALLA PRINCIPAL HOME ---
  return (
    <View style={styles.pantallaHome}>
    {renderHeaderApp()}
    <ScrollView style={styles.scrollHome} contentContainerStyle={styles.container}>
      {/* Header con Buscador rápido */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Buscar convenios</Text>
        <Text style={styles.textoUbicacion}>
          {esOffline ? 'Sin conexión. Podés consultar los convenios pendientes de firma guardados en este dispositivo.' : mensajeSede}
        </Text>
        <View style={styles.filaBuscador}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder={esOffline ? 'La búsqueda requiere conexión a internet' : 'Buscar por nombre o número de convenio'}
            placeholderTextColor={colors.textSecondary}
            editable={!esOffline}
            value={busquedaHeader}
            onChangeText={(texto) => {
              setBusquedaHeader(texto);
              setPaginaConvenios(1);
            }}
          />
          <TouchableOpacity
            style={styles.btnAvanzado}
            onPress={() => setMostrarBuscadorAvanzado(true)}
          >
            <Text style={styles.txtBtnChico}>Más filtros</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Boxes de Resumen */}
      <View style={styles.gridBoxes}>
        <View style={styles.boxMetric}>
          <Text style={styles.boxNumero}>{metricas.firmadosUltimoAnio}</Text>
          <Text style={styles.boxLabel}>Firmados en el último año</Text>
        </View>
        <View style={styles.boxMetric}>
          <Text style={styles.boxNumero}>{metricas.vigentes}</Text>
          <Text style={styles.boxLabel}>Convenios vigentes</Text>
        </View>
        <View style={styles.boxMetric}>
          <Text style={styles.boxNumero}>{metricas.enTramite}</Text>
          <Text style={styles.boxLabel}>En proceso</Text>
        </View>
        <View style={styles.boxMetric}>
          <Text style={[styles.boxNumero, { color: '#d35400' }]}>{misPendientes.length}</Text>
          <Text style={styles.boxLabel}>Pendientes de firma</Text>
        </View>
      </View>

      {/* Selector de listado: Últimos movimientos vs Mis Pendientes */}
      <View style={styles.filaTabs}>
        <TouchableOpacity
          style={[styles.tab, tabActiva === 'movimientos' && !esOffline && styles.tabActiva]}
          disabled={esOffline}
          onPress={() => {
            setTabActiva('movimientos');
            setPaginaConvenios(1);
          }}
        >
          <Text style={styles.tabTexto}>Actualizados recientemente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, (tabActiva === 'pendientes' || esOffline) && styles.tabActiva]}
          onPress={() => {
            setTabActiva('pendientes');
            setPaginaConvenios(1);
          }}
        >
          <Text style={styles.tabTexto}>Pendientes de firma ({misPendientes.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Listado */}
      {conveniosPaginados.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.itemConvenio}
          onPress={() => abrirFichaConvenio(item)}
        >
          <View style={styles.filaSuperior}>
            <Text style={styles.codigo}>{item.codigo_unico || `N.º ${item.id}`}</Text>
            <Text style={styles.estado}>{etiquetaEstado(item.estado)}</Text>
          </View>
          <Text style={styles.tituloConvenio}>{item.titulo}</Text>
          <Text style={styles.tipo}>Tocá para ver los detalles y las opciones disponibles</Text>
        </TouchableOpacity>
      ))}

      {listaVisible.length === 0 && (
        <Text style={styles.tipo}>
          {esOffline
            ? 'No hay convenios pendientes de firma guardados en este dispositivo.'
            : 'No encontramos convenios. Probá con otro nombre o número.'}
        </Text>
      )}

      {listaVisible.length > 0 && (
        <Text style={styles.historialFecha}>
          Mostrando {(paginaConveniosActual - 1) * ELEMENTOS_POR_PAGINA + 1}–{Math.min(paginaConveniosActual * ELEMENTOS_POR_PAGINA, listaVisible.length)} de {listaVisible.length} convenios.
        </Text>
      )}
      <Paginador
        pagina={paginaConveniosActual}
        totalPaginas={totalPaginasConvenios}
        alCambiar={setPaginaConvenios}
      />

      <View style={styles.filaAyuda}>
        <TouchableOpacity
          style={[styles.accesoAyuda, styles.accesoManual]}
          onPress={irAManual}
          accessibilityRole="button"
          accessibilityLabel="Abrir manual de uso"
        >
          <Text style={styles.iconoAccesoAyuda}>📖</Text>
          <Text style={styles.textoAccesoAyuda}>Manual de uso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
}