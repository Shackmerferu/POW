const API_URL = "api_almacen/almacen_api.php";

const inputCodigo = document.getElementById("codigo");
const inputCantidad = document.getElementById("cantidad");
const inputPrecio = document.getElementById("precio");

const mensajeSistema = document.getElementById("mensaje-sistema");
const contenedorTabla = document.getElementById("tabla-container");
const tablaCabecera = document.getElementById("tabla-cabecera");
const tablaCuerpo = document.getElementById("tabla-cuerpo");
const contadorProductos = document.getElementById("contador-productos");

const formAgregar = document.getElementById("form-agregar");
const modCodigo = document.getElementById("mod_codigo");
const modNombre = document.getElementById("mod_nombre");
const modCantidad = document.getElementById("mod_cantidad");
const modPrecio = document.getElementById("mod_precio");
const modImagen = document.getElementById("mod_imagen");
const btnGuardar = document.getElementById("btn-guardar-nuevo");

const formatoNumero = new Intl.NumberFormat("es-AR", {
  useGrouping: false,
  maximumFractionDigits: 2,
});

function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function leerEnteroPositivo(input) {
  const valor = input.value.trim();
  if (valor === "") {
    return null;
  }

  for (let i = 0; i < valor.length; i++) {
    const c = valor[i];
    if (c < "0" || c > "9") {
      return null;
    }
  }

  const numero = Number(valor);
  return numero > 0 ? numero : null;
}

function leerNumeroPositivo(input) {
  const valor = input.value.trim();
  if (valor === "") {
    return null;
  }
  const numero = Number(valor);
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

function mostrarMensaje(texto) {
  mensajeSistema.textContent = texto;
}

function limpiarMensaje() {
  mostrarMensaje("");
}

function mostrarContador(texto) {
  contadorProductos.textContent = texto;
  contadorProductos.classList.remove("oculto");
}

function limpiarContador() {
  contadorProductos.textContent = "";
  contadorProductos.classList.add("oculto");
}

function ocultarTabla() {
  contenedorTabla.classList.add("oculto");
  tablaCabecera.innerHTML = "";
  tablaCuerpo.innerHTML = "";
}

function renderImagen(producto) {
  if (!producto.imagen) {
    return '<td><span class="sin-imagen">—</span></td>';
  }
  const ruta = `api_almacen/imagenes/${encodeURIComponent(producto.imagen)}`;
  return `<td><img src="${escaparHtml(ruta)}" alt="Imagen de ${escaparHtml(producto.nombre)}" class="miniatura"></td>`;
}

function renderTabla(productos, { conValor = true } = {}) {
  if (!Array.isArray(productos) || productos.length === 0) {
    ocultarTabla();
    return;
  }

  tablaCabecera.innerHTML = conValor
    ? "<tr><th>ID</th><th>Nombre</th><th>Cant</th><th>Precio $</th><th>Valor $$</th><th>Imagen</th></tr>"
    : "<tr><th>ID</th><th>Nombre</th><th>Cant</th><th>Precio</th><th>Imagen</th></tr>";

  tablaCuerpo.innerHTML = productos
    .map((producto) => {
      const cantidad = Number(producto.cantidad);
      const precio = Number(producto.precio_costo);
      const valorStock = cantidad * precio;

      const celdas = [
        `<td>${escaparHtml(producto.id)}</td>`,
        `<td>${escaparHtml(producto.nombre)}</td>`,
        `<td>${escaparHtml(cantidad)}</td>`,
        `<td>${escaparHtml(formatoNumero.format(precio))}</td>`,
      ];

      if (conValor) {
        celdas.push(
          `<td>${escaparHtml(formatoNumero.format(valorStock))}</td>`,
        );
      }

      celdas.push(renderImagen(producto));
      return `<tr>${celdas.join("")}</tr>`;
    })
    .join("");

  contenedorTabla.classList.remove("oculto");
}

async function pedir(parametros = {}) {
  const url = new URL(API_URL, window.location.href);
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(clave, valor);
    }
  });

  let respuesta;
  try {
    respuesta = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  try {
    return await respuesta.json();
  } catch (error) {
    throw new Error("La API devolvió una respuesta inválida");
  }
}

function listarProductos(codigo) {
  return pedir(codigo === undefined ? {} : { codigo });
}

async function obtenerProducto(codigo) {
  const datos = await pedir({ codigo });
  if (
    datos.status === 200 &&
    Array.isArray(datos.productos) &&
    datos.productos.length > 0
  ) {
    return datos.productos[0];
  }

  const todos = await pedir({});
  if (todos.status === 200 && Array.isArray(todos.productos)) {
    const encontrado = todos.productos.find(
      (producto) => Number(producto.codigo) === Number(codigo),
    );
    if (encontrado) {
      return encontrado;
    }
  }
  return null;
}

function modificarProducto(producto) {
  return pedir({
    action: "modificar",
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    cantidad: producto.cantidad,
    precio_costo: producto.precio_costo,
    cantidad_minima: producto.cantidad_minima,
  });
}

async function insertarProducto(producto, imagen = null) {
  const datos = new FormData();
  datos.append("action", "insertar");
  datos.append("codigo", producto.codigo);
  datos.append("nombre", producto.nombre);
  datos.append("cantidad", producto.cantidad);
  datos.append("precio_costo", producto.precio_costo);
  datos.append("cantidad_minima", producto.cantidad_minima);

  if (imagen) {
    datos.append("imagen", imagen);
  }

  let respuesta;
  try {
    respuesta = await fetch(API_URL, {
      method: "POST",
      body: datos,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  try {
    return await respuesta.json();
  } catch (error) {
    throw new Error("La API devolvió una respuesta inválida");
  }
}

function borrarProducto(codigo) {
  return pedir({ action: "borrar", codigo });
}

async function mostrarProductos() {
  try {
    const datos = await listarProductos();
    const tablaVacia = datos.status === 500 && !Array.isArray(datos.productos);
    if (datos.status !== 200 && !tablaVacia) {
      throw new Error(datos.menssage || "No se pudieron obtener los productos");
    }
    const productos = Array.isArray(datos.productos) ? datos.productos : [];
    if (productos.length === 0) {
      mostrarMensaje("No hay productos cargados");
      ocultarTabla();
      limpiarContador();
      return;
    }
    productos.sort((a, b) =>
      String(a.nombre).localeCompare(String(b.nombre), "es", {
        sensitivity: "base",
      }),
    );
    limpiarMensaje();
    limpiarContador();
    renderTabla(productos, { conValor: true });
  } catch (error) {
    mostrarMensaje(error.message);
    ocultarTabla();
    limpiarContador();
  }
}

async function mostrarStockBajo() {
  try {
    const datos = await listarProductos();
    const tablaVacia = datos.status === 500 && !Array.isArray(datos.productos);
    if (datos.status !== 200 && !tablaVacia) {
      throw new Error(datos.menssage || "No se pudieron obtener los productos");
    }
    const productos = Array.isArray(datos.productos) ? datos.productos : [];
    const stockBajo = productos
      .filter(
        (producto) =>
          Number(producto.cantidad) <= Number(producto.cantidad_minima),
      )
      .sort((a, b) =>
        String(a.nombre).localeCompare(String(b.nombre), "es", {
          sensitivity: "base",
        }),
      );
    mostrarMensaje("Productos por debajo de la cantidad mínima");
    renderTabla(stockBajo, { conValor: false });
    mostrarContador(`Cantidad de productos: ${stockBajo.length}`);
  } catch (error) {
    mostrarMensaje(error.message);
    ocultarTabla();
    limpiarContador();
  }
}

async function alta() {
  limpiarMensaje();
  const codigo = leerEnteroPositivo(inputCodigo);
  const cantidad = leerEnteroPositivo(inputCantidad);
  const precio = leerNumeroPositivo(inputPrecio);

  if (codigo === null)
    return mostrarMensaje("El Código (ID) debe ser un número positivo");
  if (cantidad === null)
    return mostrarMensaje("La cantidad debe ser un número positivo");
  if (precio === null)
    return mostrarMensaje("El precio debe ser un número positivo");

  try {
    const producto = await obtenerProducto(codigo);
    if (!producto) return mostrarMensaje("Código inexistente");
    const stockActual = Number(producto.cantidad);
    const nuevoStock = stockActual + cantidad;
    const respuesta = await modificarProducto({
      ...producto,
      cantidad: nuevoStock,
      precio_costo: precio,
    });
    if (respuesta.status === 200) mostrarMensaje("Actualizado");
    else if (respuesta.status === 505) mostrarMensaje("Código inexistente");
    else
      mostrarMensaje(respuesta.menssage || "No se pudo actualizar el producto");
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

async function baja() {
  limpiarMensaje();
  const codigo = leerEnteroPositivo(inputCodigo);
  const cantidad = leerEnteroPositivo(inputCantidad);

  if (codigo === null)
    return mostrarMensaje("El Código (ID) debe ser un número positivo");
  if (cantidad === null)
    return mostrarMensaje("La cantidad debe ser un número positivo");

  try {
    const producto = await obtenerProducto(codigo);
    if (!producto) return mostrarMensaje("Código inexistente");
    const stockActual = Number(producto.cantidad);
    if (cantidad > stockActual)
      return mostrarMensaje(
        `La cantidad a retirar es superior al Stock(${stockActual})`,
      );
    const respuesta = await modificarProducto({
      ...producto,
      cantidad: stockActual - cantidad,
    });
    if (respuesta.status === 200) mostrarMensaje("Actualizado");
    else if (respuesta.status === 505) mostrarMensaje("Código inexistente");
    else
      mostrarMensaje(respuesta.menssage || "No se pudo actualizar el producto");
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

async function guardarProducto() {
  const codigo = leerEnteroPositivo(modCodigo);
  const nombre = modNombre.value.trim();
  const cantidad = leerEnteroPositivo(modCantidad);
  const precio = leerNumeroPositivo(modPrecio);

  if (codigo === null) return alert("El Código debe ser un número positivo");
  if (nombre === "") return alert("La descripción es obligatoria");
  if (cantidad === null)
    return alert("La cantidad debe ser un número positivo");
  if (precio === null)
    return alert("El precio de costo debe ser un número positivo");

  try {
    const datos = await listarProductos();
    const productos =
      datos.status === 200 && Array.isArray(datos.productos)
        ? datos.productos
        : [];
    const existente = productos.some(
      (producto) =>
        Number(producto.id) === codigo || Number(producto.codigo) === codigo,
    );
    if (existente) return alert("El producto ya existe en la base de datos");

    const respuesta = await insertarProducto(
      { codigo, nombre, cantidad, precio_costo: precio, cantidad_minima: 10 },
      modImagen.files[0] || null,
    );
    if (respuesta.status === 200) {
      alert("El producto fue guardado correctamente");
      formAgregar.reset();
      const modal = window.bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalAgregar"),
      );
      modal.hide();
      await mostrarProductos();
    } else if (respuesta.status === 505) {
      alert("El producto ya existe en la base de datos");
    } else {
      alert(respuesta.menssage || "No se pudo guardar el producto");
    }
  } catch (error) {
    alert(error.message);
  }
}

async function borrar() {
  limpiarMensaje();
  const codigo = leerEnteroPositivo(inputCodigo);
  if (codigo === null)
    return mostrarMensaje("El Código (ID) debe ser un número positivo");
  try {
    const producto = await obtenerProducto(codigo);
    if (!producto) return mostrarMensaje("Código inexistente");
    const respuesta = await borrarProducto(producto.codigo);
    if (respuesta.status === 200) {
      const tablaVisible = !contenedorTabla.classList.contains("oculto");
      mostrarMensaje("Eliminado");
      if (tablaVisible) {
        await mostrarProductos();
        mostrarMensaje("Eliminado");
      }
    } else if (respuesta.status === 505) {
      mostrarMensaje("Código inexistente");
    } else {
      mostrarMensaje(respuesta.menssage || "No se pudo eliminar el producto");
    }
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btn-mostrar")
    .addEventListener("click", mostrarProductos);
  document
    .getElementById("btn-stock-bajo")
    .addEventListener("click", mostrarStockBajo);
  document.getElementById("btn-alta").addEventListener("click", alta);
  document.getElementById("btn-baja").addEventListener("click", baja);
  document.getElementById("btn-borrar").addEventListener("click", borrar);
  document.getElementById("btn-agregar").addEventListener("click", () => {});

  if (btnGuardar) {
    btnGuardar.addEventListener("click", guardarProducto);
  }
  if (formAgregar) {
    formAgregar.addEventListener("submit", (evento) => {
      evento.preventDefault();
      guardarProducto();
    });
  }

  document
    .getElementById("form-principal")
    .addEventListener("submit", (evento) => {
      evento.preventDefault();
    });
});
