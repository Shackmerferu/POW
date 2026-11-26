import { router, useIsFocused } from 'expo-router';
import { View } from 'react-native';
import HeaderApp from '../components/molecules/HeaderApp';
import LectorQRScreen from '../screens/LectorQRScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { limpiarSesionActual } from '../utils/sesion';

export default function QRScreen() {
  const estaEnFoco = useIsFocused();
  const { colors } = useAppColorScheme();
  const cerrarSesion = async () => {
    await limpiarSesionActual();
    router.replace({ pathname: '/', params: { vista: 'login' } });
  };

  if (!estaEnFoco) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderApp alCerrarSesion={cerrarSesion} />
      <LectorQRScreen
        key="lector-qr-activo"
        alCerrar={() => router.replace('/')}
        alEscanear={(codigo) => router.navigate({ pathname: '/', params: { codigoQR: String(codigo).trim() } })}
      />
    </View>
  );
}