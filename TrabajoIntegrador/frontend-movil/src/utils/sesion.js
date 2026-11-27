import AsyncStorage from '@react-native-async-storage/async-storage';

export async function limpiarSesionActual() {
  const tokenActual = await AsyncStorage.getItem('@token_jwt');
  if (tokenActual) {
    await AsyncStorage.setItem('@token_jwt_biometria', tokenActual);
  }
  await AsyncStorage.removeItem('@token_jwt');
}
