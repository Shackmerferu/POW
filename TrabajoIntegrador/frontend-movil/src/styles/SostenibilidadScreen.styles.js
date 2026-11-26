import { StyleSheet } from 'react-native';
import { escalarEstilos } from '../utils/escalaTexto';

export const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
      titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
      tarjeta: {
        backgroundColor: colors.positiveBackground,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
      },
      dato: { fontSize: 16, fontWeight: 'bold', color: colors.positive, marginBottom: 10 },
      cajaSupuestos: {
        backgroundColor: colors.backgroundElement,
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: colors.border,
      },
      supuestosTitulo: { fontWeight: 'bold', marginBottom: 10, color: colors.text },
      supuestoItem: { color: colors.textSecondary, marginBottom: 5, fontSize: 14 },
    }),
    s
  );