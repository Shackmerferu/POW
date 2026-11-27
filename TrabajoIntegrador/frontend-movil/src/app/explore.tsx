import { View } from 'react-native';
import { router } from 'expo-router';
import HeaderApp from '../components/molecules/HeaderApp';
import SostenibilidadScreen from '../screens/SostenibilidadScreen';
import { useAppColorScheme } from '../contexts/ColorSchemeContext';
import { limpiarSesionActual } from '../utils/sesion';

export default function EcoScreen() {
  const { colors } = useAppColorScheme();
  const cerrarSesion = async () => {
    await limpiarSesionActual();
    router.replace({ pathname: '/', params: { vista: 'login' } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderApp alCerrarSesion={cerrarSesion} />
      <SostenibilidadScreen />
    </View>
  );
}
