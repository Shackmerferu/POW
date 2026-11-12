/*
  Adaptación al patrón de Prueba1:
  - endpointCantidad devuelve {cantidad: N}
  - endpointPorId recibe ?id=X y devuelve {persona:{id,dni,...}}
  - IDs consecutivos desde 1
  - los DNI están ordenados al consultar por ID.
  Si no se cumplen estas condiciones, no es válida esta búsqueda binaria.
*/
async function buscarPorDNI(dniBuscado, endpointCantidad, endpointPorId) {
  const cantidadData = await api.get(endpointCantidad, {}, true);
  const cantidad = Number(cantidadData.cantidad ?? cantidadData.total);
  if (!Number.isInteger(cantidad) || cantidad < 0) throw new Error("Cantidad inválida.");

  let inicio = 1, fin = cantidad;
  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    const data = await api.get(endpointPorId, {id:medio}, true);
    const persona = data.persona ?? data.data;
    const dni = Number(persona?.dni);
    if (!Number.isFinite(dni)) throw new Error("No se recibió un DNI válido.");
    if (dni === Number(dniBuscado)) return persona;
    if (dni < Number(dniBuscado)) inicio = medio + 1;
    else fin = medio - 1;
  }
  return null;
}
