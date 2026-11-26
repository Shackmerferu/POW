import { StyleSheet } from 'react-native';
import { escalarEstilos } from '../utils/escalaTexto';

export const createStyles = (colors, s = 1) =>
  escalarEstilos(
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
    }),
    s
  );