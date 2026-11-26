/**
 * Escala únicamente las propiedades tipográficas de un StyleSheet.
 * El resto de las medidas (paddings, anchos, bordes) se mantiene igual.
 */
export function escalarEstilos(estilos, escala = 1) {
  if (!escala || escala === 1) return estilos;

  const resultado = {};

  Object.keys(estilos).forEach((clave) => {
    const estilo = estilos[clave];

    if (!estilo || typeof estilo !== 'object') {
      resultado[clave] = estilo;
      return;
    }

    const nuevo = { ...estilo };

    if (typeof nuevo.fontSize === 'number') {
      nuevo.fontSize = Math.round(nuevo.fontSize * escala * 100) / 100;
    }
    if (typeof nuevo.lineHeight === 'number') {
      nuevo.lineHeight = Math.round(nuevo.lineHeight * escala * 100) / 100;
    }

    resultado[clave] = nuevo;
  });

  return resultado;
}
