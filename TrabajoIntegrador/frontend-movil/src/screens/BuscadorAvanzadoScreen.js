import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import Boton from '../components/atoms/Boton';

export default function BuscadorAvanzadoScreen({ convenios, alSeleccionar, alCerrar, esOffline }) {
  const { colors } = useAppColorScheme();
  const styles = createStyles(colors);

  const [texto, setTexto] = useState('');
  const [anio, setAnio] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');

  const filtrados = useMemo(() => {
    return convenios.filter((c) => {
      const q = texto.trim().toLowerCase();
      const coincideTexto =
        !q ||
        String(c.titulo || '').toLowerCase().includes(q) ||
        String(c.codigo_unico || '').toLowerCase().includes(q) ||
        String(c.resolucion || '').toLowerCase().includes(q);

      const fechaRef = String(c.fecha_inicio || c.fecha_firma || c.fecha_actualizacion || '');
      const coincideAnio = !anio.trim() || fechaRef.startsWith(anio.trim());

      const coincideEstado =
        estadoFiltro === 'todos' ||
        String(c.estado || '').toLowerCase() === estadoFiltro;

      return coincideTexto && coincideAnio && coincideEstado;
    });
  }, [convenios, texto, anio, estadoFiltro]);

  // Construcción del árbol: Padres (raíz) -> Hijos (id_antecedente === padre.id)
  const arbol = useMemo(() => {
    const idsFiltrados = new Set(filtrados.map((c) => c.id));
    const raices = filtrados.filter((c) => !c.id_antecedente || !idsFiltrados.has(c.id_antecedente));

    const obtenerHijos = (idPadre) =>
      filtrados.filter((c) => Number(c.id_antecedente) === Number(idPadre));

    return raices.map((padre) => ({
      ...padre,
      hijos: obtenerHijos(padre.id),
    }));
  }, [filtrados]);

  if (esOffline) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Buscador Avanzado</Text>
        <View style={styles.cardOffline}>
          <Text style={styles.textoOffline}>
            📡 Estás en Modo Offline. El buscador avanzado no está disponible sin conexión.
          </Text>
        </View>
        <Boton titulo="Volver al Panel" onPress={alCerrar} secundario={true} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Buscador Avanzado (Árbol)</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar por título, código o resolución..."
        placeholderTextColor={colors.textSecondary}
        value={texto}
        onChangeText={setTexto}
      />
      <TextInput
        style={styles.input}
        placeholder="Filtrar por año (ej: 2026)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={anio}
        onChangeText={setAnio}
      />

      <View style={styles.filaFiltros}>
        {['todos', 'aprobado', 'firmado', 'revision', 'borrador'].map((est) => (
          <TouchableOpacity
            key={est}
            style={[styles.chip, estadoFiltro === est && styles.chipActivo]}
            onPress={() => setEstadoFiltro(est)}
          >
            <Text style={[styles.chipTexto, estadoFiltro === est && styles.chipTextoActivo]}>
              {est.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.contador}>Resultados encontrados: {filtrados.length}</Text>

      {arbol.map((padre) => (
        <View key={padre.id} style={styles.nodoPadre}>
          <TouchableOpacity onPress={() => alSeleccionar(padre)}>
            <Text style={styles.codigoPadre}>
              📁 {padre.codigo_unico || `ID #${padre.id}`} [{String(padre.estado || '').toUpperCase()}]
            </Text>
            <Text style={styles.tituloNodo}>{padre.titulo}</Text>
          </TouchableOpacity>

          {/* Resolución asignada */}
          {padre.resolucion ? (
            <Text style={styles.hoja}>├── 📜 Resolución: {padre.resolucion}</Text>
          ) : null}

          {/* Documentación asignada al padre */}
          {(padre.documentos || []).map((doc) => (
            <Text key={doc.id} style={styles.hoja}>
              ├── 📄 Doc ({doc.tipo_documento}): {doc.ruta_archivo}
            </Text>
          ))}

          {/* Convenios hijos */}
          {padre.hijos.map((hijo) => (
            <View key={hijo.id} style={styles.nodoHijo}>
              <TouchableOpacity onPress={() => alSeleccionar(hijo)}>
                <Text style={styles.codigoHijo}>
                  └── 📂 Hijo: {hijo.codigo_unico || `ID #${hijo.id}`} - {hijo.titulo}
                </Text>
              </TouchableOpacity>
              {hijo.resolucion ? (
                <Text style={styles.hojaHijo}>    ├── 📜 Res: {hijo.resolucion}</Text>
              ) : null}
              {(hijo.documentos || []).map((d) => (
                <Text key={d.id} style={styles.hojaHijo}>
                      └── 📄 {d.tipo_documento}: {d.ruta_archivo}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ))}

      <Boton titulo="Volver al Panel" onPress={alCerrar} secundario={true} />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
    titulo: { fontSize: 22, fontWeight: 'bold', color: colors.accent, marginBottom: 14, textAlign: 'center' },
    input: {
      backgroundColor: colors.backgroundElement,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    },
    filaFiltros: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundElement,
    },
    chipActivo: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipTexto: { fontSize: 11, color: colors.text, fontWeight: '600' },
    chipTextoActivo: { color: '#fff' },
    contador: { fontSize: 13, color: colors.textSecondary, marginBottom: 10 },
    nodoPadre: {
      backgroundColor: colors.backgroundElement,
      padding: 12,
      borderRadius: 10,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      marginBottom: 12,
    },
    codigoPadre: { fontSize: 12, fontWeight: 'bold', color: colors.accent },
    tituloNodo: { fontSize: 15, fontWeight: '600', color: colors.text, marginVertical: 4 },
    hoja: { fontSize: 12, color: colors.textSecondary, marginLeft: 8, marginTop: 2 },
    nodoHijo: { marginLeft: 12, marginTop: 6, borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: 8 },
    codigoHijo: { fontSize: 13, fontWeight: '600', color: colors.text },
    hojaHijo: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
    cardOffline: { backgroundColor: colors.backgroundElement, padding: 20, borderRadius: 10, marginVertical: 20 },
    textoOffline: { color: colors.text, textAlign: 'center', fontSize: 15 },
  });