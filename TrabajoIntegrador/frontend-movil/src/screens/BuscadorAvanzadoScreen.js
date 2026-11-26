import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Paginador from '../components/molecules/Paginador';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { useFontScale } from '../contexts/FontScaleContext';
import { createStyles } from '../styles/BuscadorAvanzadoScreen.styles';

const ELEMENTOS_POR_PAGINA = 10;

const etiquetasEstado = {
  todos: 'Todos',
  aprobado: 'Listo para firmar',
  firmado: 'Firmado',
  revision: 'En revisión',
  borrador: 'Borrador',
};

export default function BuscadorAvanzadoScreen({ convenios, alSeleccionar, esOffline }) {
  const { colors } = useAppColorScheme();
  const { escala } = useFontScale();
  const styles = useMemo(() => createStyles(colors, escala), [colors, escala]);

  const [texto, setTexto] = useState('');
  const [anio, setAnio] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [pagina, setPagina] = useState(1);

  const cambiarTexto = (t) => {
    setTexto(t);
    setPagina(1);
  };

  const cambiarAnio = (a) => {
    setAnio(a);
    setPagina(1);
  };

  const cambiarEstado = (e) => {
    setEstadoFiltro(e);
    setPagina(1);
  };

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

  const totalPaginas = Math.ceil(arbol.length / ELEMENTOS_POR_PAGINA);
  const paginaActual = Math.min(pagina, Math.max(totalPaginas, 1));
  const arbolPaginado = arbol.slice(
    (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaActual * ELEMENTOS_POR_PAGINA
  );

  if (esOffline) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Búsqueda de convenios</Text>
        <View style={styles.cardOffline}>
          <Text style={styles.textoOffline}>
            No hay conexión a internet. La búsqueda con filtros estará disponible cuando vuelvas a conectarte.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Buscar convenios</Text>
      <Text style={styles.contador}>Encontrá convenios por nombre, número, resolución, año o estado.</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre, número o resolución"
        placeholderTextColor={colors.textSecondary}
        value={texto}
        onChangeText={cambiarTexto}
      />
      <TextInput
        style={styles.input}
        placeholder="Año (por ejemplo, 2026)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={anio}
        onChangeText={cambiarAnio}
      />

      <View style={styles.filaFiltros}>
        {['todos', 'aprobado', 'firmado', 'revision', 'borrador'].map((est) => (
          <TouchableOpacity
            key={est}
            style={[styles.chip, estadoFiltro === est && styles.chipActivo]}
            onPress={() => cambiarEstado(est)}
          >
            <Text style={[styles.chipTexto, estadoFiltro === est && styles.chipTextoActivo]}>
              {etiquetasEstado[est]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.contador}>
        {filtrados.length === 1 ? '1 convenio encontrado' : `${filtrados.length} convenios encontrados`}
      </Text>

      {filtrados.length === 0 && (
        <View style={styles.cardOffline}>
          <Text style={styles.textoOffline}>No encontramos convenios con esos datos. Probá cambiar la búsqueda o los filtros.</Text>
        </View>
      )}

      {arbolPaginado.map((padre) => (
        <View key={padre.id} style={styles.nodoPadre}>
          <TouchableOpacity onPress={() => alSeleccionar(padre)}>
            <Text style={styles.codigoPadre}>
              {padre.codigo_unico || `N.º ${padre.id}`} · {etiquetasEstado[String(padre.estado || '').toLowerCase()] || 'Estado no disponible'}
            </Text>
            <Text style={styles.tituloNodo}>{padre.titulo}</Text>
          </TouchableOpacity>

          {/* Resolución asignada */}
          {padre.resolucion ? (
            <Text style={styles.hoja}>Resolución: {padre.resolucion}</Text>
          ) : null}

          {/* Documentación asignada al padre */}
          {(padre.documentos || []).map((doc) => (
            <Text key={doc.id} style={styles.hoja}>
              Documento ({doc.tipo_documento}): {doc.ruta_archivo}
            </Text>
          ))}

          {/* Convenios hijos */}
          {padre.hijos.map((hijo) => (
            <View key={hijo.id} style={styles.nodoHijo}>
              <TouchableOpacity onPress={() => alSeleccionar(hijo)}>
                <Text style={styles.codigoHijo}>
                  Convenio relacionado: {hijo.codigo_unico || `N.º ${hijo.id}`} · {hijo.titulo}
                </Text>
              </TouchableOpacity>
              {hijo.resolucion ? (
                <Text style={styles.hojaHijo}>Resolución: {hijo.resolucion}</Text>
              ) : null}
              {(hijo.documentos || []).map((d) => (
                <Text key={d.id} style={styles.hojaHijo}>
                      Documento ({d.tipo_documento}): {d.ruta_archivo}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ))}

      <Paginador
        pagina={paginaActual}
        totalPaginas={totalPaginas}
        alCambiar={setPagina}
      />
    </ScrollView>
  );
}