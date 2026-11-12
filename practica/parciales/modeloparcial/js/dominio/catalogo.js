// =====================================================
// 3. CATÁLOGO DE PRODUCTOS
// =====================================================

// Solicita al servidor los productos correspondientes
// a la categoría seleccionada y actualiza el catálogo.
async function cargarProductos() {
  // Obtiene el valor seleccionado en el filtro de categorías.
  const categoria = document.getElementById("filtroCategoria").value;

  try {
    // Envía una petición GET al endpoint de productos.
    // encodeURIComponent permite enviar la categoría en la URL
    // sin romperla si contiene espacios u otros caracteres.
    const respuesta = await fetch(
      `api/productos.php?action=listar&categoria=${encodeURIComponent(categoria)}`,
      { credentials: "same-origin" },
    );

    // Convierte la respuesta JSON en un objeto de JavaScript.
    const resultado = await respuesta.json();

    // Comprueba que la petición haya sido exitosa
    // y que el servidor informe el estado esperado.
    if (!respuesta.ok || resultado.status !== 200) {
      throw new Error(
        resultado.message || "No se pudieron cargar los productos.",
      );
    }

    // Dibuja las tarjetas con los productos recibidos.
    // Si data no existe, utiliza un array vacío.
    renderizarCatalogo(resultado.data || []);

    // Si el usuario es administrador, también actualiza
    // el listado de productos de su panel de gestión.
    if (
      rolUsuario === "admin" &&
      typeof window.cargarProductosAdmin === "function"
    ) {
      await window.cargarProductosAdmin();
    }
  } catch (error) {
    // Si falla la consulta, informa el problema en el catálogo.
    productosDiv.innerHTML = `
      <div class="col-12">
        <p class="text-danger">No se pudo cargar el catálogo.</p>
      </div>
    `;

    // Registra el error técnico en la consola del navegador.
    console.error("Error al cargar productos:", error);
  }
}

// Genera las tarjetas HTML de todos los productos recibidos.
function renderizarCatalogo(productos) {
  // Si no existen productos, muestra un mensaje y termina.
  if (productos.length === 0) {
    productosDiv.innerHTML = `
      <div class="col-12">
        <p class="text-muted">No hay productos disponibles.</p>
      </div>
    `;
    return;
  }

  // Recorre los productos y genera una tarjeta por cada uno.
  productosDiv.innerHTML = productos
    .map(function (producto) {
      // Convierte los valores recibidos a números.
      const stock = Number(producto.stock);
      const precio = Number(producto.precio);

      // Solo los usuarios con rol cliente pueden comprar.
      const esCliente = rolUsuario === "cliente";

      // Almacena el botón que se mostrará en cada tarjeta.
      // Por defecto, no se muestra ningún botón de compra.
      let botonCompra = "";

      // Si el usuario es cliente y hay stock,
      // permite agregar el producto al carrito.
      if (esCliente && stock > 0) {
        botonCompra = `
          <button
            type="button"
            class="agregar-carrito btn btn-warning w-100"
            data-id="${Number(producto.id)}"
            data-nombre="${escaparHTML(producto.nombre)}"
            data-precio="${precio}"
            data-stock="${stock}">
            Agregar al carrito
          </button>
        `;

        // Si el cliente consulta un producto sin stock,
        // muestra un botón deshabilitado.
      } else if (esCliente && stock <= 0) {
        botonCompra = `
          <button
            type="button"
            class="btn btn-secondary w-100"
            disabled>
            Sin stock
          </button>
        `;
      }

      // Construye la tarjeta del producto.
      // Los datos de texto se escapan antes de insertarse en HTML.
      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <article class="producto-card card h-100">

            ${
              // Si el producto tiene imagen, la muestra.
              // Si no tiene, utiliza un espacio de imagen alternativo.
              producto.imagen
                ? `
                  <img
                    src="${escaparHTML(producto.imagen)}"
                    class="card-img-top"
                    alt="${escaparHTML(producto.nombre)}"
                    loading="lazy">
                `
                : `
                  <div class="product-image-placeholder">
                    <span>Termo Store</span>
                  </div>
                `
            }

            <div class="card-body">

              <!-- Nombre del producto. -->
              <h3 class="card-title">
                ${escaparHTML(producto.nombre)}
              </h3>

              <!-- Descripción del producto. -->
              <p class="card-text">
                ${escaparHTML(producto.descripcion)}
              </p>

              <!-- Precio formateado para Argentina. -->
              <p class="precio">
                $${precio.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <!-- Cantidad de unidades disponibles. -->
              <p class="product-stock">
                Stock disponible: ${stock}
              </p>

              <!-- Botón correspondiente al rol y al stock. -->
              ${botonCompra}

            </div>
          </article>
        </div>
      `;
    })
    .join(""); // Une todas las tarjetas en una sola cadena HTML.

  // Actualiza el estado de los botones de agregar al carrito.
  actualizarBotonesCarrito();
}

// Actualiza los botones del catálogo según las cantidades
// que ya están agregadas al carrito.
function actualizarBotonesCarrito() {
  // Selecciona todos los botones para agregar productos.
  document.querySelectorAll(".agregar-carrito").forEach(function (boton) {
    // Obtiene el ID del producto asociado al botón.
    const id = Number(boton.dataset.id);

    // Busca si ese producto ya está en el carrito.
    const productoCarrito = carrito.find((p) => p.id === id);

    // Si está en el carrito, obtiene su cantidad actual.
    // Si no está, la cantidad se considera cero.
    const cantidad = productoCarrito ? productoCarrito.cantidad : 0;

    // Obtiene el stock asociado al botón.
    const stock = Number(boton.dataset.stock);

    // Deshabilita el botón si el usuario no es cliente
    // o si ya agregó todas las unidades disponibles.
    boton.disabled = rolUsuario !== "cliente" || cantidad >= stock;

    // Cambia el texto para informar si se alcanzó el límite.
    boton.textContent =
      cantidad >= stock ? "Stock agregado al carrito" : "Agregar al carrito";
  });
}

// =====================================================
