const NOMBRE_BD = 'gestion-convenios';
const VERSION_BD = 2;

export const ALMACENES = Object.freeze({
  convenios: 'convenios',
  metricas: 'metricas',
  usuarios: 'usuarios',
  personas: 'personas',
  unidades: 'unidades',
  pendientes: 'pendientes',
});

function abrirBD() {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.reject(new Error('IndexedDB no está disponible.'));
  }

  return new Promise((resolver, rechazar) => {
    const peticion = indexedDB.open(NOMBRE_BD, VERSION_BD);

    peticion.onupgradeneeded = () => {
      const bd = peticion.result;

      for (const almacen of Object.values(ALMACENES)) {
        if (bd.objectStoreNames.contains(almacen)) continue;

        if (almacen === ALMACENES.pendientes) {
          bd.createObjectStore(almacen, { keyPath: 'id' });
        } else {
          bd.createObjectStore(almacen);
        }
      }
    };

    peticion.onsuccess = () => resolver(peticion.result);
    peticion.onerror = () => rechazar(peticion.error);
  });
}

export async function guardarCache(almacen, datos) {
  let bd;

  try {
    bd = await abrirBD();

    await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(almacen, 'readwrite');
      transaccion.objectStore(almacen).put(datos, 'datos');
      transaccion.oncomplete = resolver;
      transaccion.onerror = () => rechazar(transaccion.error);
      transaccion.onabort = () => rechazar(transaccion.error);
    });

    return true;
  } catch (error) {
    console.warn(`No se pudo guardar el caché de "${almacen}":`, error);
    return false;
  } finally {
    bd?.close();
  }
}

export async function leerCache(almacen) {
  let bd;

  try {
    bd = await abrirBD();

    return await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(almacen, 'readonly');
      const pedido = transaccion.objectStore(almacen).get('datos');
      pedido.onsuccess = () => resolver(pedido.result ?? null);
      pedido.onerror = () => rechazar(pedido.error);
    });
  } catch (error) {
    console.warn(`No se pudo leer el caché de "${almacen}":`, error);
    return null;
  } finally {
    bd?.close();
  }
}

export async function guardarPendiente(operacion) {
  let bd;

  try {
    bd = await abrirBD();

    const pendiente = {
      ...operacion,
      id:
        operacion.id ||
        (window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : null) ||
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      creado_en: operacion.creado_en || new Date().toISOString(),
      conflicto: false,
    };

    await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(ALMACENES.pendientes, 'readwrite');
      transaccion.objectStore(ALMACENES.pendientes).put(pendiente);
      transaccion.oncomplete = resolver;
      transaccion.onerror = () => rechazar(transaccion.error);
      transaccion.onabort = () => rechazar(transaccion.error);
    });

    return pendiente;
  } finally {
    bd?.close();
  }
}

export async function listarPendientes() {
  let bd;

  try {
    bd = await abrirBD();

    return await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(ALMACENES.pendientes, 'readonly');
      const pedido = transaccion.objectStore(ALMACENES.pendientes).getAll();

      pedido.onsuccess = () =>
        resolver(
          (pedido.result || []).sort((a, b) =>
            a.creado_en.localeCompare(b.creado_en)
          )
        );
      pedido.onerror = () => rechazar(pedido.error);
    });
  } finally {
    bd?.close();
  }
}

export async function eliminarPendiente(id) {
  let bd;

  try {
    bd = await abrirBD();

    await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(ALMACENES.pendientes, 'readwrite');
      transaccion.objectStore(ALMACENES.pendientes).delete(id);
      transaccion.oncomplete = resolver;
      transaccion.onerror = () => rechazar(transaccion.error);
      transaccion.onabort = () => rechazar(transaccion.error);
    });
  } finally {
    bd?.close();
  }
}

export async function marcarPendienteEnConflicto(id, mensaje) {
  let bd;

  try {
    bd = await abrirBD();

    await new Promise((resolver, rechazar) => {
      const transaccion = bd.transaction(ALMACENES.pendientes, 'readwrite');
      const almacen = transaccion.objectStore(ALMACENES.pendientes);
      const pedido = almacen.get(id);

      pedido.onsuccess = () => {
        if (!pedido.result) return;

        almacen.put({
          ...pedido.result,
          conflicto: true,
          mensaje_conflicto: mensaje,
        });
      };

      pedido.onerror = () => rechazar(pedido.error);
      transaccion.oncomplete = resolver;
      transaccion.onerror = () => rechazar(transaccion.error);
      transaccion.onabort = () => rechazar(transaccion.error);
    });
  } finally {
    bd?.close();
  }
}
