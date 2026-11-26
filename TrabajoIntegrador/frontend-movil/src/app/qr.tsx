import { router } from 'expo-router';
import LectorQRScreen from '../screens/LectorQRScreen';

export default function QRScreen() {
  return (
    <LectorQRScreen
      alCerrar={() => router.replace('/')}
      alEscanear={(codigo) => router.replace({ pathname: '/', params: { codigoQR: codigo } })}
    />
  );
}
