import { router } from 'expo-router';
import SostenibilidadScreen from '../screens/SostenibilidadScreen';

export default function EcoScreen() {
  return <SostenibilidadScreen alCerrar={() => router.replace('/')} />;
}
