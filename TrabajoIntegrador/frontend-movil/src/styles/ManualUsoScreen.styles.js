import { StyleSheet } from 'react-native';
import { escalarEstilos } from '../utils/escalaTexto';

export const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
      titulo: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center', marginBottom: 14 },
      tarjeta: {
        backgroundColor: colors.backgroundElement,
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      cardTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.accent, marginBottom: 5 },
      texto: { fontSize: 13, color: colors.text, lineHeight: 19 },
    }),
    s
  );