
// =====================================================
// ADMINISTRACIÓN DE PRODUCTOS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // REFERENCIAS HTML
    // =====================================================

    const formulario = document.getElementById("formProducto");
    const contenedor = document.getElementById("adminProductos");
    const campoId = document.getElementById("productoId");
    const campoToken = document.getElementById("tokenForm");
    const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

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


    // =====================================================
    // MOSTRAR MENSAJES
    // =====================================================

    function mensaje(texto, tipo = "success") {

        const alertas = document.getElementById("alertas");

        if (!alertas) {
            console.error("No se encontró el contenedor de alertas.");
            return;
        }

        alertas.innerHTML = `
            <div class="alert alert-${tipo}" role="alert">
                ${escaparHTML(texto)}
            </div>
        `;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // =====================================================
    // OBTENER TOKEN
    // =====================================================

    function obtenerToken() {

        return campoToken ? campoToken.value : "";
    }


    // =====================================================
    // CARGAR PRODUCTOS PARA ADMINISTRACIÓN
    // =====================================================

    async function cargarProductosAdmin() {

        if (!contenedor) {
            console.error("No se encontró el contenedor adminProductos.");
            return;
        }

        try {

            const respuesta = await fetch("api/productos.php?action=listar", {
                credentials: "same-origin"
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.status !== 200) {

                throw new Error(
                    resultado.message || "Error al cargar productos."
                );
            }

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


    // =====================================================
    // RENDERIZAR PRODUCTOS
    // =====================================================

    function renderizarProductos(productos) {

        if (!contenedor) {
            return;
        }

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

                            <p>
                                Stock: ${Number(producto.stock)}
                            </p>

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
                                        ? `
                                            <button
                                                type="button"
                                                class="btn btn-danger flex-fill"
                                                data-admin-accion="eliminar"
                                                data-id="${Number(producto.id)}">

                                                Eliminar

                                            </button>
                                        `
                                        : ""
                                }

                            </div>

                        </div>

                    </article>

                </div>
            `;

        }).join("");
    }


    // =====================================================
    // EDITAR PRODUCTO
    // =====================================================

    async function editarProducto(id) {

        try {

            const respuesta = await fetch("api/productos.php?action=listar", {
                credentials: "same-origin"
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.status !== 200) {

                throw new Error(
                    resultado.message || "No se pudo consultar el producto."
                );
            }

            const producto = (resultado.data || []).find(function (p) {

                return Number(p.id) === Number(id);

            });

            if (!producto) {

                mensaje("No se encontró el producto.", "danger");
                return;
            }

            // Cargar los datos en el formulario.

            campoId.value = producto.id;

            document.getElementById("nombreProducto").value =
                producto.nombre;

            document.getElementById("categoriaProducto").value =
                producto.categoria;

            document.getElementById("descripcionProducto").value =
                producto.descripcion;

            document.getElementById("imagenProducto").value =
                producto.imagen;

            document.getElementById("precioProducto").value =
                producto.precio;

            document.getElementById("stockProducto").value =
                producto.stock;

            // Desplazarse hasta el formulario.

            formulario.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (error) {

            mensaje(error.message, "danger");
        }
    }


    // =====================================================
    // CANCELAR EDICIÓN
    // =====================================================

    function cancelarEdicion() {

        if (!formulario || !campoId) {
            return;
        }

        formulario.reset();
        campoId.value = "";
    }


    // =====================================================
    // INSERTAR O MODIFICAR PRODUCTO
    // =====================================================

    if (formulario) {

        formulario.addEventListener("submit", async function (evento) {

            evento.preventDefault();

            const datos = new FormData(formulario);

            // Si hay ID, modifica. Si está vacío, inserta.

            const accion = campoId.value ? "modificar" : "insertar";

            datos.append("action", accion);

            // Incluir token de seguridad.

            datos.set("token", obtenerToken());

            try {

                const respuesta = await fetch("api/productos.php", {

                    method: "POST",
                    body: datos,
                    credentials: "same-origin"

                });

                const resultado = await respuesta.json();

                if (
                    !respuesta.ok ||
                    resultado.status < 200 ||
                    resultado.status >= 300
                ) {

                    throw new Error(
                        resultado.message || "No se pudo guardar el producto."
                    );
                }

                mensaje(resultado.message);

                cancelarEdicion();

                // Actualizar el catálogo.

                if (typeof window.cargarProductos === "function") {

                    await window.cargarProductos();
                }

                // Actualizar la administración.

                await cargarProductosAdmin();

            } catch (error) {

                mensaje(error.message, "danger");
            }
        });
    }


    // =====================================================
    // EVENTOS DE LOS PRODUCTOS
    // =====================================================

    if (contenedor) {

        contenedor.addEventListener("click", async function (evento) {

            const boton = evento.target.closest("[data-admin-accion]");

            if (!boton) {
                return;
            }

            const accion = boton.dataset.adminAccion;
            const id = Number(boton.dataset.id);


            // EDITAR PRODUCTO

            if (accion === "editar") {

                await editarProducto(id);

                return;
            }


            // ELIMINAR PRODUCTO

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

                        throw new Error(
                            resultado.message || "No se pudo eliminar el producto."
                        );
                    }

                    mensaje(resultado.message);

                    // Actualizar catálogo.

                    if (typeof window.cargarProductos === "function") {

                        await window.cargarProductos();
                    }

                    // Actualizar administración.

                    await cargarProductosAdmin();

                } catch (error) {

                    mensaje(error.message, "danger");
                }
            }
        });
    }


    // =====================================================
    // BOTÓN CANCELAR EDICIÓN
    // =====================================================

    if (btnCancelarEdicion) {

        btnCancelarEdicion.addEventListener(
            "click",
            cancelarEdicion
        );
    }


    // =====================================================
    // EXPONER FUNCIÓN PARA OTROS ARCHIVOS JS
    // =====================================================

    window.cargarProductosAdmin = cargarProductosAdmin;

});
