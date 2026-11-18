// CACHEAR OFFLINE — persistencia local con IndexedDB para trabajar sin
// conexión. Hay un almacén por fuente de datos del panel (una por pestaña
// disponible según el rol), de modo que cada vista guarda su propia copia.
//
// Estrategia:
//   · Lectura: la API primero; si falla, se recupera la última copia local.
//   · Escritura: cada respuesta exitosa sobrescribe la copia del almacén.
//
// Los conflictos de actualización se resuelven con la concurrencia
// optimista que ya aplica el backend (fecha_actualizacion): el cliente
// nunca sobrescribe en silencio una versión más reciente del servidor.

const NOMBRE_BD = "gestion-convenios";
const VERSION_BD = 1;

// Un almacén por pestaña del panel (más unidades, que alimentan a varias).
export const ALMACENES = Object.freeze({
  convenios: "convenios", // pestaña Administración (y base de métricas/vencimientos)
  metricas: "metricas", // pestaña Métricas
  usuarios: "usuarios", // pestaña Roles
  personas: "personas", // tabla Personas y pasantías (pestaña Roles)
  unidades: "unidades", // apoyo transversal
});

function abrirBD() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.reject(new Error("IndexedDB no está disponible."));
  }

  return new Promise((resolver, rechazar) => {
    const peticion = indexedDB.open(NOMBRE_BD, VERSION_BD);

    peticion.onupgradeneeded = () => {
      const bd = peticion.result;
      Object.values(ALMACENES).forEach((almacen) => {
        if (!bd.objectStoreNames.contains(almacen)) {
          bd.createObjectStore(almacen);
        }
      });
    };

    peticion.onsuccess = () => resolver(peticion.result);
    peticion.onerror = () => rechazar(peticion.error);
  });
}

/** Guarda `datos` en el almacén indicado (clave única por almacén). */
export async function guardarCache(almacen, datos) {
  try {
    const bd = await abrirBD();
    await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(almacen, "readwrite");
      transaccion.objectStore(almacen).put(datos, "datos");
      transaccion.oncomplete = resolver;
      transaccion.onerror = () => rechazar(transaccion.error);
    });
    bd.close();
    return true;
  } catch (error) {
    // El caché es una mejora: si IndexedDB falla (modo privado, etc.), la
    // app sigue funcionando normalmente contra la API.
    console.warn(`No se pudo guardar el caché de "${almacen}":`, error);
    return false;
  }
}

/** Devuelve la última copia guardada del almacén, o null si no hay. */
export async function leerCache(almacen) {
  try {
    const bd = await abrirBD();
    const datos = await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(almacen, "readonly");
      const pedido = transaccion.objectStore(almacen).get("datos");
      pedido.onsuccess = () => resolver(pedido.result ?? null);
      pedido.onerror = () => rechazar(pedido.error);
    });
    bd.close();
    return datos;
  } catch (error) {
    console.warn(`No se pudo leer el caché de "${almacen}":`, error);
    return null;
  }
}
