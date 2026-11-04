document.addEventListener("DOMContentLoaded", function () {
    const URL_API = "http://localhost/finalFebrero2026/simulacroParcial2025/proyecto/api_almacen/almacen_api.php"

    const inputID = document.getElementById("inputID");
    const inputCant = document.getElementById("inputCantidad");
    const inputPrecio = document.getElementById("inputPrecio");

    const btnAlta = document.getElementById("btnAlta");
    const btnBaja = document.getElementById("btnBaja");
    const btnStockBajo = document.getElementById("btnStockBajo");
    const btnMostrar = document.getElementById("btnMostrar");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnBorrar = document.getElementById("btnBorrar");

    const agregarModal = new bootstrap.Modal(document.getElementById("agregarModal"));
    const btnGuardar = document.getElementById("btnGuardar");
    const modalForm = document.getElementById("modalForm");

    btnMostrar.addEventListener("click", function () {
        mostrarProductos();
    });

    btnStockBajo.addEventListener("click", function () {
        mostrarProductosBajos();
    })

    btnBaja.addEventListener("click", function () {
        const idVALOR = inputID.value;
        const cantVALOR = inputCant.value;
        if (parseInt(idVALOR) > 0 && parseInt(cantVALOR) > 0) {
            const tablaBody = document.getElementById("body");
            tablaBody.innerHTML = "";
            fetch(URL_API + `?id=${idVALOR}`)
                .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    }
                    else {
                        tablaBody.innerHTML = "<tr><td><h1>Producto no encontrado</h1></td></tr>";
                        console.error("Producto no encontrado");
                    }
                })
                .then(data => {
                    data.productos.forEach(producto => {
                        if (parseInt(cantVALOR) > parseInt(producto.cantidad)) {
                            tablaBody.innerHTML = `<tr><td><h1>La
                                                cantidad a retirar es superior al Stock (${producto.cantidad})</h1></td></tr>`;
                        } else {
                            let cantFinal = parseInt(producto.cantidad) - parseInt(cantVALOR);
                            actualizarProducto(inputID, cantFinal, producto.codigo, producto.nombre, producto.precio_costo, producto.cantidad_minima);
                        }
                    })
                })

        } else {
            inputCant.value = "";
            inputID.value = "";
            alert("Debe ingresar un ID y una cantidad válidos");
        }

    });

    btnAlta.addEventListener("click", function () {
        const idVALOR = inputID.value;
        const cantVALOR = inputCant.value;
        const precioVALOR = inputPrecio.value;
        if (parseInt(idVALOR) > 0 && parseInt(cantVALOR) > 0 && parseInt(precioVALOR) > 0) {
            const tablaBody = document.getElementById("body");
            tablaBody.innerHTML = "";
            fetch(URL_API + `?id=${idVALOR}`)
                .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    }
                    else {
                        tablaBody.innerHTML = "<tr><td><h1>Producto no encontrado</h1></td></tr>";
                        console.error("Producto no encontrado");
                    }
                })
                .then(data => {
                    data.productos.forEach(producto => {
                        let cantFinal = parseInt(producto.cantidad) + parseInt(cantVALOR);
                        let PPP = ((parseInt(producto.cantidad) * parseInt(producto.precio_costo)) + (parseInt(cantVALOR) * parseInt(precioVALOR))) / (parseInt(producto.cantidad) + parseInt(cantVALOR));
                        actualizarProducto(inputID, cantFinal, producto.codigo, producto.nombre, PPP.toFixed(2), producto.cantidad_minima);
                    })
                })
        } else {
            inputCant.value = "";
            inputID.value = "";
            inputPrecio.value = "";
            alert("Debe ingresar un ID, una cantidad y un precio válidos");
        }
    });


    btnAgregar.addEventListener("click", function () {
        modalForm.reset();
        agregarModal.show();

    });

    btnGuardar.addEventListener("click", function () {
        guardarProducto();
    });

    btnBorrar.addEventListener("click", function () {
        const idVALOR = inputID.value;
        if (parseInt(idVALOR) > 0) {
            if (confirm("Esta seguro de realizar la accion?")) {
                borrarProducto(parseInt(idVALOR));
            }
        } else {
            inputID.value = "";
            alert("Debe ingresar un ID válido");
        }
    });


    function mostrarProductos() {
        const tablaBody = document.getElementById("body");
        tablaBody.innerHTML = "";
        fetch(URL_API)
            .then(response => response.json())
            .then(data => {
                const productos = data.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

                productos.forEach(producto => {
                    let tr = document.createElement("tr");
                    let tdID = document.createElement("td");
                    let tdNombre = document.createElement("td");
                    let tdCantidad = document.createElement("td");
                    let tdPrecio = document.createElement("td");
                    let tdCantMinima = document.createElement("td");
                    let tdvalor = document.createElement("td");

                    tdID.textContent = producto.codigo;
                    tdNombre.textContent = producto.nombre;
                    tdCantidad.textContent = producto.cantidad;
                    tdPrecio.textContent = producto.precio_costo;
                    tdCantMinima.textContent = producto.cantidad_minima;
                    tdvalor.textContent = parseInt(producto.cantidad) * parseInt(producto.precio_costo);

                    tr.appendChild(tdID);
                    tr.appendChild(tdNombre);
                    tr.appendChild(tdCantidad);
                    tr.appendChild(tdPrecio);
                    tr.appendChild(tdCantMinima);
                    tr.appendChild(tdvalor);

                    tablaBody.appendChild(tr);


                });


            })
    }


    function mostrarProductosBajos() {
        const tablaBody = document.getElementById("body");
        tablaBody.innerHTML = "";
        fetch(URL_API)
            .then(response => response.json())
            .then(data => {
                const productos = data.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

                productos.forEach(producto => {
                    if (parseInt(producto.cantidad) <= parseInt(producto.cantidad_minima)) {
                        let tr = document.createElement("tr");
                        let tdID = document.createElement("td");
                        let tdNombre = document.createElement("td");
                        let tdCantidad = document.createElement("td");
                        let tdPrecio = document.createElement("td");
                        let tdCantMinima = document.createElement("td");
                        let tdvalor = document.createElement("td");

                        tdID.textContent = producto.codigo;
                        tdNombre.textContent = producto.nombre;
                        tdCantidad.textContent = parseInt(producto.cantidad);
                        tdPrecio.textContent = parseInt(producto.precio_costo);
                        tdCantMinima.textContent = parseInt(producto.cantidad_minima);
                        tdvalor.textContent = parseInt(producto.cantidad) * parseInt(producto.precio_costo);

                        tr.appendChild(tdID);
                        tr.appendChild(tdNombre);
                        tr.appendChild(tdCantidad);
                        tr.appendChild(tdPrecio);
                        tr.appendChild(tdCantMinima);
                        tr.appendChild(tdvalor);

                        tablaBody.appendChild(tr);

                    }
                });


            })
    }


    function actualizarProducto(id, cantidad, codigo, nombre, precio, cantMinima) {
        const tablaBody = document.getElementById("body");
        tablaBody.innerHTML = "";
        fetch(URL_API + `?action=modificar&id=${id}&codigo=${codigo}&nombre=${nombre}&cantidad=${cantidad}&precio_costo=${precio}&cantidad_minima=${cantMinima}`)
            .then(response => {
                if (response.status == 200) {
                    mostrarProductos();
                    alert("Producto modificado con éxito");
                } else {
                    tablaBody.innerHTML = "<tr><td><h1>Error al modificar el producto</h1></td></tr>";
                    console.error("Error al modificar el producto");
                }
            })

    }


    async function guardarProducto() {

        const codigo = modalCodigo.value;
        const nombre = modalNombre.value;
        const cantidad = modalCantidad.value;
        const precioCosto = modalPrecioCosto.value;
        const cantidadMinima = modalCantidadMinima.value;
        const imagen = document.getElementById("modalImagen");
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
            const responseListar = await fetch(URL_API);
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
            
            

            const responseInsert = await fetch(`${URL_API}?action=insertar`, {
                method: "POST",
                body: params
            });
            const dataInsert = await responseInsert.json();

            if (dataInsert.status == 200) {
                alert("Producto fue guardado");
                agregarModal.hide(); // Ocultamos el modal

                // (d) Actualizar la tabla principal
                mostrarProductos();
            } else {
                alert("Error al guardar: " + (dataInsert.menssage || dataInsert.Mensaje));
            }

        } catch (error) {
            console.error("Error en la operación de AGREGAR:", error);
            alert("Error de conexión. No se pudo completar la operación.");
        }
    }

    function borrarProducto(id) {
        fetch(URL_API + `?action=borrar&codigo=${id}`)
            .then(response => {
                if (response.status == 200) {
                    mostrarProductos();
                    alert("Producto borrado con éxito");
                } else {
                    console.error("Error al borrar el producto");
                    alert("Error al borrar el producto");
                }
            })
    }

});