// Esperar a que el DOM esté cargado antes de acceder a elementos
document.addEventListener("DOMContentLoaded", function () {

    /* Selección de elementos del DOM
       - botones principales (mostrar, alta, baja, etc.)
       - contenedores de la tabla y campos de entrada */
    const mostrar = document.getElementById("mostrar");
    const alta = document.getElementById("alta");
    const baja = document.getElementById("baja");
    const stockBajo = document.getElementById("stock-bajo");
    const agregar = document.getElementById("agregar");
    const borrar = document.getElementById("borrar");

    const tablaContainer = document.getElementById("tabla-resultados-container");
    const tablaBody = document.getElementById("tabla-body");

    const id = document.getElementById("codigo");
    const cant = document.getElementById("cantidad");

    const agregarModal = new bootstrap.Modal(document.getElementById("agregarModal"));
    const btnGuardar = document.getElementById("btnGuardar");
    const modalForm = document.getElementById("modalForm");

    const modalCodigo = document.getElementById("modalCodigo");
    const modalNombre = document.getElementById("modalNombre");
    const modalCantidad = document.getElementById("modalCantidad");
    const modalPrecioCosto = document.getElementById("modalPrecioCosto");
    const modalCantidadMinima = document.getElementById("modalCantidadMinima");

    // -----------------------------------------------------------------
    // Listeners: acciones de los botones (llaman a las funciones abajo)
    // -----------------------------------------------------------------
    mostrar.addEventListener("click", function () {
        obtenerProductos();
    });

    alta.addEventListener("click", function () {
        sumarProducto(id.value, cant.value);
    });

    baja.addEventListener("click", function () {
        restarProducto(id.value, cant.value);
    });

    stockBajo.addEventListener("click", function () {
        obtenerProductosMinimos();
    });

    agregar.addEventListener("click", function () {
        modalForm.reset();
        agregarModal.show();
    });

    btnGuardar.addEventListener("click", function () {
        guardarProducto();
    });

    borrar.addEventListener("click", function () {
        const codigo = id.value;

        // 1. Validar el input
        if (!codigo || parseInt(codigo) <= 0) {
            alert("Por favor, ingrese un Código (ID) positivo para borrar");
            return;
        }

        // 2. Pedir confirmación
        const confirmar = confirm(`¿Está seguro de que desea borrar el producto con código ${codigo}?`);

        if (confirmar) {
            console.log('Confirmado borrar', codigo);
            borrarProducto(codigo);
        }
    });

    // -----------------------------------------------------------------
    // Funciones: interacción con la API (fetch) y renderizado de resultados
    // -----------------------------------------------------------------
    function obtenerProductos() {
        // La API está en la carpeta api_almacen
        const url = "api_almacen/almacen_api.php?action=listar";
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // lanzar con status para debug
                    throw new Error("Error en la solicitud: " + response.status + " " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.status == 200) {
                    dibujarTabla(data.productos);
                } else {
                    alert("Error al obtener los productos: " + (data.menssage || JSON.stringify(data)));
                }
            })
            .catch(error => {
                console.error("Error al obtener los productos: ", error);
                alert("no se pudo conectar a la API");
            })
    }

    function dibujarTabla(productos) {
        tablaBody.innerHTML = "";
        productos.forEach(producto => {
            let valorTotal = producto.precio_costo * producto.cantidad;
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio_costo}</td>
                <td>${producto.cantidad_minima}</td>
                <td>${valorTotal}</td>
            `;
            tablaBody.appendChild(fila);
        });
        tablaContainer.classList.remove("d-none");

    }

    function obtenerProductosMinimos() {
        const url = "api_almacen/almacen_api.php?action=listar";
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.status + " " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.status == 200) {
                    dibujarTablaMinimos(data.productos);
                } else {
                    alert("Error al obtener los productos: " + (data.menssage || JSON.stringify(data)));
                }
            })
            .catch(error => {
                console.error("Error al obtener los productos: ", error);
                alert("no se pudo conectar a la API");
            })
    }

    function dibujarTablaMinimos(productos) {
        // seguridad: productos debe ser un array
        if (!Array.isArray(productos)) {
            console.error('dibujarTablaMinimos: "productos" no es un array', productos);
            alert('Respuesta inesperada de la API. Revisa la consola.');
            return;
        }

        // Filtramos correctamente usando una función
        const productosMinimos = productos.filter(p => {
            // convertir a número para evitar comparaciones extrañas
            const cantidad = Number(p.cantidad);
            const minima = Number(p.cantidad_minima);
            return !isNaN(cantidad) && !isNaN(minima) && cantidad <= minima;
        });

        tablaBody.innerHTML = "";
        productosMinimos.forEach(producto => {
            let valorTotal = producto.precio_costo * producto.cantidad;
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio_costo}</td>
                <td>${producto.cantidad_minima}</td>
                <td>${valorTotal}</td>
            `;
            tablaBody.appendChild(fila);
        });
        tablaContainer.classList.remove("d-none");
    }

    function restarProducto(id, cant) {

        if (!id || !cant || parseInt(id) < 0 || parseInt(cant) < 0) {
            alert("codigo y cantidad deben ser positivos")
            return;
        }

        fetch("api_almacen/almacen_api.php?action=listar&id=" + id)
            .then(response => { return response.json() })
            .then(data => {
                if (data.status != 200) {
                    alert("Error al obtener el producto");
                    return;
                }

                const producto = data.productos[0];
                const cantActual = parseInt(producto.cantidad);
                const cantRestar = parseInt(cant);

                if (cantRestar > cantActual) {
                    alert("Cantidad a retirar superior al Stock:" + cantActual);
                    return;
                }

                const nuevaCant = cantActual - cantRestar;

                const url = new URLSearchParams();
                url.append("action", "modificar");
                url.append("id", producto.id);
                url.append("codigo", producto.codigo);
                url.append("cantidad", nuevaCant);
                url.append("nombre", producto.nombre);
                url.append("precio_costo", producto.precio_costo);
                url.append("cantidad_minima", producto.cantidad_minima);

                return fetch("api_almacen/almacen_api.php?" + url.toString());
            })
            .then(response => {
                if (!response) return;

                return response.json();
            })
            .then(dataUpdate => {
                if (!dataUpdate) return;

                if (dataUpdate.status == 200) {
                    alert("Producto actualizado");
                    id.value = "";
                    cant.value = "";
                } else {
                    alert(`Error al actualizar: ${dataUpdate.menssage}`);
                }
            })
            .catch(error => {
                console.error("Error en la operación de BAJA:", error);
                alert("Error de conexión. No se pudo completar la operación.");
            });
    }


    function sumarProducto(id, cant) {
        if (!id || !cant || parseInt(id) < 0 || parseInt(cant) < 0) {
            alert("codigo y cantidad deben ser positivos")
            return;
        }

        fetch("api_almacen/almacen_api.php?action=listar&id=" + id)
            .then(response => { return response.json() })
            .then(data => {
                if (data.status != 200) {
                    alert("Error al obtener el producto");
                    return;
                }

                const producto = data.productos[0];
                const cantActual = parseInt(producto.cantidad);
                const cantSumar = parseInt(cant);

                if (cantSumar < 0) {
                    return cantSumar = 0;
                }

                const nuevaCant = cantActual + cantSumar;

                const url = new URLSearchParams();
                url.append("action", "modificar");
                url.append("id", producto.id);
                url.append("codigo", producto.codigo);
                url.append("cantidad", nuevaCant);
                url.append("nombre", producto.nombre);
                url.append("precio_costo", producto.precio_costo);
                url.append("cantidad_minima", producto.cantidad_minima);

                return fetch("api_almacen/almacen_api.php?" + url.toString());
            })
            .then(response => {
                if (!response) return;

                return response.json();
            })
            .then(dataUpdate => {
                if (!dataUpdate) return;

                if (dataUpdate.status == 200) {
                    alert("Producto actualizado");
                    id.value = "";
                    cant.value = "";
                } else {
                    alert(`Error al actualizar: ${dataUpdate.menssage}`);
                }
            })
            .catch(error => {
                console.error("Error en la operación de BAJA:", error);
                alert("Error de conexión. No se pudo completar la operación.");
            });
    }

    async function guardarProducto() {

        const codigo = modalCodigo.value;
        const nombre = modalNombre.value;
        const cantidad = modalCantidad.value;
        const precioCosto = modalPrecioCosto.value;
        const cantidadMinima = modalCantidadMinima.value;
        const imagen= document.getElementById("modalImagen");
        const archivoImagen = imagen.files[0];

        // Validación (a)
        // (El campo 'descripcion' existe en tu HTML pero no en la API, así que no lo validamos)
        if (!codigo || !nombre || !cantidad || !precioCosto || !cantidadMinima) {
            alert("Los campos Codigo, Nombre, Cantidad, Precio Costo y Cant. Mínima son requeridos.");
            return;
        }
        if (parseInt(codigo) <= 0 || parseInt(cantidad) <= 0 || parseInt(precioCosto) <= 0 || parseInt(cantidadMinima) <= 0) {
            alert("Código, Cantidad, Precio y Cant. Mínima deben ser números positivos.");
            return;
        }

        try {
            // Validación (b): Verificar si el CÓDIGO ya existe
            const responseListar = await fetch("api_almacen/almacen_api.php?action=listar");
            const dataListar = await responseListar.json();

            if (dataListar.status != 200) {
                alert("Error al verificar el producto: " + dataListar.menssage);
                return;
            }

            // Buscar por 'p.codigo' (código de producto), no 'p.id'
            const existe = dataListar.productos.find(p => p.codigo == codigo);

            if (existe) {
                alert("El producto (código " + codigo + ") ya existe en la base de datos");
                return;
            }

            // Si no existe, procedemos
            const params = new FormData(); //antes era URLSearchParams() pero cambiamos por FormData para manejar archivos
            //params.append("action", "insertar");
            params.append("codigo", codigo);
            params.append("nombre", nombre);
            params.append("cantidad", cantidad);
            params.append("precio_costo", precioCosto);
            params.append("cantidad_minima", cantidadMinima);
            if (archivoImagen) {
                params.append("imagen", archivoImagen);
            }
            // (No enviamos 'descripcion' porque la API no lo acepta)

            const responseInsert = await fetch("api_almacen/almacen_api.php?action=insertar", {
                method: "POST",
                body: params
            });
            const dataInsert = await responseInsert.json();

            if (dataInsert.status == 200) {
                alert("Producto fue guardado");
                agregarModal.hide(); // Ocultamos el modal

                // (d) Actualizar la tabla principal
                obtenerProductos();
            } else {
                alert("Error al guardar: " + (dataInsert.menssage || dataInsert.Mensaje));
            }

        } catch (error) {
            console.error("Error en la operación de AGREGAR:", error);
            alert("Error de conexión. No se pudo completar la operación.");
        }
    }

    function borrarProducto(id) {
        fetch(`api_almacen/almacen_api.php?action=borrar&codigo=${id}`)
            .then(response => {
                // siempre intentar leer el JSON para manejar mensajes de error del servidor
                return response.json().then(data => ({ ok: response.ok, status: response.status, data }));
            })
            .then(({ ok, status, data }) => {
                if (ok && data && data.status == 200) {
                    alert("Producto borrado");
                    // limpiar el campo de input (usar el elemento DOM, no la variable local 'codigo')
                    const inputCodigo = document.getElementById('codigo');
                    if (inputCodigo) inputCodigo.value = "";
                    obtenerProductos();
                } else {
                    // Mostrar mensaje del servidor si existe
                    const msg = (data && (data.menssage || data.Mensaje)) ? (data.menssage || data.Mensaje) : JSON.stringify(data);
                    alert(`No se pudo borrar el producto (HTTP ${status}): ${msg}`);
                }
            })
            .catch(error => {
                console.error("Error en la operación de BORRAR:", error);
                alert("Error de conexión. No se pudo completar la operación.");
            });
    }
   
});