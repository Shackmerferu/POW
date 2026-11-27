import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppColorScheme } from '../../contexts/ColorSchemeContext';
import { useFontScale } from '../../contexts/FontScaleContext';
import { escalarEstilos } from '../../utils/escalaTexto';

export default function Paginador({ pagina, totalPaginas, alCambiar }) {
  const { colors } = useAppColorScheme();
  const { escala } = useFontScale();
  const estilos = escalarEstilos(styles, escala);

  if (totalPaginas <= 1) return null;

  return (
    <View style={estilos.contenedor}>
      <TouchableOpacity
        style={[estilos.boton, { borderColor: colors.border }, pagina <= 1 && estilos.deshabilitado]}
        disabled={pagina <= 1}
        onPress={() => alCambiar(pagina - 1)}
        accessibilityRole="button"
        accessibilityLabel="Página anterior"
      >
        <Text style={[estilos.textoBoton, { color: colors.accent }]}>‹ Anterior</Text>
      </TouchableOpacity>
      <Text style={[estilos.textoPagina, { color: colors.textSecondary }]}>
        Página {pagina} de {totalPaginas}
      </Text>
      <TouchableOpacity
        style={[estilos.boton, { borderColor: colors.border }, pagina >= totalPaginas && estilos.deshabilitado]}
        disabled={pagina >= totalPaginas}
        onPress={() => alCambiar(pagina + 1)}
        accessibilityRole="button"
        accessibilityLabel="Página siguiente"
      >
        <Text style={[estilos.textoBoton, { color: colors.accent }]}>Siguiente ›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginVertical: 10 },
  boton: { minHeight: 38, justifyContent: 'center', paddingHorizontal: 10, borderWidth: 1, borderRadius: 8 },
  textoBoton: { fontSize: 12, fontWeight: '700' },
  textoPagina: { flex: 1, textAlign: 'center', fontSize: 12 },
  deshabilitado: { opacity: 0.4 },
});
