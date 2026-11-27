import { StyleSheet } from 'react-native';
import { escalarEstilos } from '../utils/escalaTexto';

export const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      container: { flexGrow: 1, padding: 18, backgroundColor: colors.background },
      titulo: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center', marginBottom: 8 },
      subInfo: { fontSize: 12, color: colors.textSecondary, marginBottom: 10, textAlign: 'center' },
      tarjeta: {
        backgroundColor: colors.backgroundElement,
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      tarjetaAlerta: { borderLeftWidth: 4, borderLeftColor: '#d97706' },
      cardTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.accent, marginBottom: 5 },
      texto: { fontSize: 13, color: colors.text, lineHeight: 19 },
      avisoFlotante: {
        position: 'absolute',
        left: 12,
        right: 12,
        zIndex: 10,
        elevation: 6,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      avisoTexto: { fontSize: 13, fontWeight: '600', lineHeight: 19 },
    }),
    s
  );