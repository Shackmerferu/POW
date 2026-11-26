import { StyleSheet } from 'react-native';
import { escalarEstilos } from '../utils/escalaTexto';

export const createStyles = (colors, s = 1) =>
  escalarEstilos(
    StyleSheet.create({
      container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
      titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: colors.accent },
      temporizador: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: colors.warning },
      texto: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: colors.text },
      marcoCamara: {
        height: 350,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: colors.accent,
      },
    }),
    s
  );