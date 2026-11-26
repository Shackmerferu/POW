import { router } from 'expo-router';
import PerfilScreen from '../screens/PerfilScreen';
import { limpiarSesionActual } from '../utils/sesion';

export default function ProfileRoute() {
  const cerrarSesion = async () => {
    await limpiarSesionActual();
    router.replace({ pathname: '/', params: { vista: 'login' } });
  };

  return <PerfilScreen alCerrarSesion={cerrarSesion} />;
}
