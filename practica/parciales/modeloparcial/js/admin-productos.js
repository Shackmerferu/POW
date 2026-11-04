// js/admin-productos.js

// Esperamos a que el HTML esté disponible.
document.addEventListener("DOMContentLoaded", function () {

    // Referencias a los elementos del formulario.
    const formulario = document.getElementById("formProducto");
    const contenedor = document.getElementById("adminProductos");
    const campoId = document.getElementById("productoId");
    const campoToken = document.getElementById("tokenForm");

    // Escapamos los valores antes de insertarlos en HTML.
    // Así evitamos que nombres o descripciones se interpreten como etiquetas.
    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
            const equivalencias = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return equivalencias[caracter];
        });
    }

    // Muestra mensajes usando el contenedor común de la página.
    function mensaje(texto, tipo = "success") {
        const alertas = document.getElementById("alertas");

        alertas.innerHTML = `
            <div class="alert alert-${tipo}" role="alert">
                ${escaparHTML(texto)}
            </div>
        `;

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Obtiene el token actualizado desde el formulario.
    function obtenerToken() {
        return campoToken.value;
    }

    // Solicita la lista de productos al PHP.
    async function cargarProductosAdmin() {
        try {
            const respuesta = await fetch(
                "api/productos.php?action=listar",
                { credentials: "same-origin" }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.status !== 200) {
                throw new Error(resultado.message || "Error al cargar productos.");
            }

            // El servidor devuelve datos; JavaScript decide cómo mostrarlos.
            renderizarProductos(resultado.data || []);

        } catch (error) {
            contenedor.innerHTML = `
                <div class="col-12">
                    <p class="text-danger">
                        No se pudieron cargar los productos.
                    </p>
                </div>
            `;

            console.error(error);
        }
    }

    // Construye las tarjetas administrativas con los datos recibidos.
    function renderizarProductos(productos) {
        if (productos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12">
                    <p>No hay productos para administrar.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = productos.map(function (producto) {
            return `
                <div class="col-12 col-sm-6 col-lg-4">
                    <article class="producto-card card h-100">
                        ${
                            producto.imagen
                                ? `<img
                                    src="${escaparHTML(producto.imagen)}"
                                    class="card-img-top"
                                    alt="${escaparHTML(producto.nombre)}"
                                    loading="lazy">`
                                : `<div class="product-image-placeholder">
                                    <span>Termo Store</span>
                                   </div>`
                        }

                        <div class="card-body">
                            <h3 class="card-title">
                                ${escaparHTML(producto.nombre)}
                            </h3>

                            <p class="card-text">
                                ${escaparHTML(producto.descripcion)}
                            </p>

                            <p class="precio">
                                $${Number(producto.precio).toLocaleString("es-AR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>

                            <p>Stock: ${Number(producto.stock)}</p>

                            <p>
                                Estado:
                                ${Number(producto.activo) === 1 ? "Activo" : "Inactivo"}
                            </p>

                            <div class="d-flex gap-2">
                                <button
                                    type="button"
                                    class="btn btn-primary flex-fill"
                                    data-admin-accion="editar"
                                    data-id="${Number(producto.id)}">
                                    Editar
                                </button>

                                ${
                                    Number(producto.activo) === 1
                                        ? `<button
                                            type="button"
                                            class="btn btn-danger flex-fill"
                                            data-admin-accion="eliminar"
                                            data-id="${Number(producto.id)}">
                                            Eliminar
                                           </button>`
                                        : ""
                                }
                            </div>
                        </div>
                    </article>
                </div>
            `;
        }).join("");
    }

    // Busca un producto concreto para cargar sus datos en el formulario.
    async function editarProducto(id) {
        try {
            const respuesta = await fetch(
                "api/productos.php?action=listar",
                { credentials: "same-origin" }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.status !== 200) {
                throw new Error(resultado.message || "No se pudo consultar el producto.");
            }

            const producto = (resultado.data || []).find(function (p) {
                return Number(p.id) === Number(id);
            });

            if (!producto) {
                mensaje("No se encontró el producto.", "danger");
                return;
            }

            // Copiamos los valores del producto a los campos del formulario.
            campoId.value = producto.id;
            document.getElementById("nombreProducto").value = producto.nombre;
            document.getElementById("categoriaProducto").value = producto.categoria;
            document.getElementById("descripcionProducto").value = producto.descripcion;
            document.getElementById("imagenProducto").value = producto.imagen;
            document.getElementById("precioProducto").value = producto.precio;
            document.getElementById("stockProducto").value = producto.stock;

            document.getElementById("formProducto").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (error) {
            mensaje(error.message, "danger");
        }
    }

    // Limpia los campos y deja el formulario listo para un alta nueva.
    function cancelarEdicion() {
        formulario.reset();
        campoId.value = "";
    }

    // Envía el formulario a PHP para insertar o modificar.
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const datos = new FormData(formulario);

        // El ID vacío indica un alta; con ID se modifica.
        const accion = campoId.value ? "modificar" : "insertar";
        datos.append("action", accion);

        // Incluimos el token para que PHP valide la solicitud.
        datos.set("token", obtenerToken());

        try {
            const respuesta = await fetch("api/productos.php", {
                method: "POST",
                body: datos,
                credentials: "same-origin"
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.status < 200 || resultado.status >= 300) {
                throw new Error(resultado.message || "No se pudo guardar el producto.");
            }

            mensaje(resultado.message);
            cancelarEdicion();

            // Actualizamos tanto el catálogo como el listado administrativo.
            if (typeof window.cargarProductos === "function") {
                await window.cargarProductos();
            }

            await cargarProductosAdmin();

        } catch (error) {
            mensaje(error.message, "danger");
        }
    });

    // Detecta los clics en los botones de editar y eliminar.
    // Se utiliza un único listener para todas las tarjetas.
    contenedor.addEventListener("click", async function (evento) {
        const boton = evento.target.closest("[data-admin-accion]");

        if (!boton) {
            return;
        }

        const accion = boton.dataset.adminAccion;
        const id = Number(boton.dataset.id);

        if (accion === "editar") {
            await editarProducto(id);
            return;
        }

        if (accion === "eliminar") {
            if (!confirm("¿Querés eliminar este producto del catálogo?")) {
                return;
            }

            const datos = new FormData();
            datos.append("action", "borrar");
            datos.append("id", String(id));
            datos.append("token", obtenerToken());

            try {
                const respuesta = await fetch("api/productos.php", {
                    method: "POST",
                    body: datos,
                    credentials: "same-origin"
                });

                const resultado = await respuesta.json();

                if (!respuesta.ok || resultado.status !== 200) {
                    throw new Error(resultado.message || "No se pudo eliminar el producto.");
                }

                mensaje(resultado.message);

                if (typeof window.cargarProductos === "function") {
                    await window.cargarProductos();
                }

                await cargarProductosAdmin();

            } catch (error) {
                mensaje(error.message, "danger");
            }
        }
    });

    // Permite cancelar una edición sin guardar los cambios.
    document.getElementById("btnCancelarEdicion")
        .addEventListener("click", cancelarEdicion);

    // Exponemos la función para que app.js pueda actualizar el listado.
    window.cargarProductosAdmin = cargarProductosAdmin;

});