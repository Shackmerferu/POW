document.addEventListener('DOMContentLoaded', function () {
    const contenedorMensajes = document.getElementById("contenedorMensajes");
    const contenidoTabla = document.getElementById("contenidoTabla");
    const mostrar = document.getElementById("mostrar");
    const listarStockBajo = document.getElementById("stockBajo");
    const codigo = document.getElementById("codigo");
    const cant = document.getElementById("cantidad");
    const baja = document.getElementById("baja");
    const alta = document.getElementById("alta");
    const precio = document.getElementById("precio");
    const agregar = document.getElementById("agregar");
    const borrar = document.getElementById("borrar");

    //modal
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    const codigoModal = document.getElementById("codigoModal");
    const nombreModal = document.getElementById("nombreModal");
    const cantidadModal = document.getElementById("cantidadModal");
    const precioModal = document.getElementById("precioCostoModal");
    const cantidadMinimaModal = document.getElementById("cantMinimaModal");
    const btnGuardar = document.getElementById("btnGuardar");

    //funcion mostrar
    mostrar.addEventListener("click", function () {
        mostrarProducto();
    });

    //funcion listar stock bajo
    listarStockBajo.addEventListener("click", function () {
        mostrarProdBajo();
    });

    //funcion dar baja producto
    baja.addEventListener("click", function () {
        bajaProducto();
    });

    //funcion dar alta producto
    alta.addEventListener("click", function () {
        altaProducto();
    });

    //funcion mostrar modal
    agregar.addEventListener("click", function () {
        modal.show();
        codigoModal.value = "";
        nombreModal.value = "";
        cantidadModal.value = "";
        precioModal.value = "";
        cantidadMinimaModal.value = "";
    });

    borrar.addEventListener("click", function () {
        eliminarProducto();
    })


    //---------------------------------------------------------------------------------------------------------//
    function mostrarProducto() {
        var URI = 'http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php';
        fetch(URI)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error:' + response.status + ' ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.status == 200) {
                    realizarTabla(data.productos);
                } else {
                    alert("Error al obtener los datos");
                }
            })
            .catch(error => {
                console.error("Error de fetch:", error);
                alert("Error al conectar con la API");
            })
    }

    function realizarTabla(productos) {
        contenidoTabla.innerHTML = "";
        productos.forEach(producto => {
            let valor = producto.precio_costo * producto.cantidad;
            const fila = document.createElement('tr');
            fila.innerHTML = `<tr>
                                <td>${producto.id}</td>
                                <td>${producto.nombre}</td>
                                <td>${producto.cantidad}</td>
                                <td>${producto.precio_costo}</td>
                                <td>${producto.cantidad_minima}</td>
                                <td>${valor}</td>
                            </tr>`;
            contenidoTabla.appendChild(fila);

        });
    }
    //---------------------------------------------------------------------------------------------------------//
    function mostrarProdBajo() {
        var URI = 'http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=listar';
        fetch(URI)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error:' + response.status + ' ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.status == 200) {
                    listarProductosStockBajo(data.productos);
                } else {
                    alert("Error al obtener los datos");
                }
            })
            .catch(error => {
                console.error("Error de fetch:", error);
                alert("Error al conectar con la API");
            })
    }

    function listarProductosStockBajo(productos) {
        contenidoTabla.innerHTML = "";
        productos.forEach(producto => {
            let cantActual = Number(producto.cantidad);
            let cantMinima = Number(producto.cantidad_minima);
            if (cantActual <= cantMinima) {
                let valor = Number(producto.precio_costo) * cantActual;
                const fila = document.createElement('tr');
                fila.innerHTML = `<tr>
                                <td>${producto.id}</td>
                                <td>${producto.nombre}</td>
                                <td>${producto.cantidad}</td>
                                <td>${producto.precio_costo}</td>
                                <td>${producto.cantidad_minima}</td>
                                <td>${valor}</td>
                            </tr>`;
                contenidoTabla.appendChild(fila);
            }
        })
    }
    //---------------------------------------------------------------------------------------------------------//
    function bajaProducto() {
        var id = codigo.value;
        var cantidadRestar = parseInt(cant.value);

        if (id > 0 && cantidadRestar > 0) {
            fetch('http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=listar&id=' + id)
                .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    } else {
                        contenedorMensajes.innerHTML = "Error al obtener el producto";
                        throw new Error('Error:' + response.status + ' ' + response.statusText);
                        return;
                    }
                })
                .then(data => {
                    let producto = data.productos[0];
                    let cantActual = parseInt(producto.cantidad);

                    if (cantidadRestar > cantActual) {
                        contenedorMensajes.innerHTML = "La cantidad a restar es mayor a la cantidad actual";
                        return;
                    }

                    let nuevaCantidad = cantActual - parseInt(cantidadRestar);
                    //api_almacen/almacen_api.php?action=modificar&id=8&codigo=1111&nombre=Arrozgallo
                    //&cantidad=12&precio_costo=100&cantidad_minima=12

                    var URI = `http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=modificar&id=${producto.id}&codigo=${producto.codigo}&nombre=${producto.nombre}&cantidad=${nuevaCantidad}&precio_costo=${producto.precio_costo}&cantidad_minima=${producto.cantidad_minima}`
                    fetch(URI)
                        .then(response => {
                            if (response.status == 200) {
                                contenedorMensajes.innerHTML = "Actualizado";
                                mostrarProducto();
                            }
                        });

                })
                .catch(error => {
                    console.error("error de fetch:", error);

                })
        }
    }
    //---------------------------------------------------------------------------------------------------------//
    function altaProducto() {
        var id = parseInt(codigo.value);
        var cantidadEntrada = parseInt(cant.value);
        var precioCostoEntrada = parseInt(precio.value);

        if (id > 0 && cantidadEntrada > 0 && precioCostoEntrada > 0) {
            fetch('http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=listar&id=' + id)
                .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    } else {
                        contenedorMensajes.innerHTML = "ERROR Condigo (ID) inexistente";
                        throw new Error('Error:' + response.status + ' ' + response.statusText);
                        return;
                    }
                })
                .then(data => {
                    let producto = data.productos[0];
                    let cantActual = parseInt(producto.cantidad);
                    let precioCostoActual = parseInt(producto.precio_costo);

                    let PPP = ((cantActual * precioCostoActual) + (cantidadEntrada * precioCostoEntrada)) / (cantActual + cantidadEntrada);
                    let cantNUEVA = cantActual + cantidadEntrada;

                    var URI = `http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=modificar&id=${producto.id}&codigo=${producto.codigo}&nombre=${producto.nombre}&cantidad=${cantNUEVA}&precio_costo=${PPP}&cantidad_minima=${producto.cantidad_minima}`
                    fetch(URI)
                        .then(response => {
                            if (response.status == 200) {
                                contenedorMensajes.innerHTML = "Actualizacion exitosa";
                                mostrarProducto();
                            }
                        })
                })
                .catch(error => {
                    console.error("error de fetch:", error);
                })
        } else {
            contenedorMensajes.innerHTML = "Corrobore que los campos ingresados sean correctos (TODOS POSITIVOS)";
        }
    }
    //---------------------------------------------------------------------------------------------------------//
    //Agregar nuevo producto
    btnGuardar.addEventListener("click", function () {
        const codigo = parseInt(codigoModal.value);
        const nombre = nombreModal.value.trim();
        const cantidad = parseInt(cantidadModal.value);
        const precio = parseFloat(precioModal.value);
        const cantidadMinima = parseInt(cantMinimaModal.value);

        if (!codigo || nombre === "" || cantidad < 0 || precio < 0 || cantidadMinima < 0) {
            alert("Todos los campos son requeridos y deben ser valores positivos.");
            return;
        }


        fetch(`http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?codigo=${codigo}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    alert("El producto ya existe en la base de datos.");
                } else {
                    return realizarInsercion(codigo, nombre, cantidad, precio, cantidadMinima);
                }
            })
            .catch(error => console.error("Error:", error));
    });

    function realizarInsercion(codigo, nombre, cantidad, precio, cantidadMinima) {
        const URI = `http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=insertar&codigo=${codigo}&nombre=${nombre}&cantidad=${cantidad}&precio_costo=${precio}&cantidad_minima=${cantidadMinima}`;

        fetch(URI)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    alert("El producto fue guardado.");
                    mostrarProducto();
                    modal.hide();
                } else {
                    alert("Error al intentar guardar el producto.");
                }
            });
    }
    //---------------------------------------------------------------------------------------------------------//
    function eliminarProducto() {
    // 1. Obtenemos el valor del input (el código que ves en la tabla)
    var cod = document.getElementById("codigo").value;

    if (cod > 0) {
        // 2. Pedimos confirmación al usuario
        if (confirm("¿Está seguro que desea eliminar el producto con código: " + cod + "?")) {
            
            // 3. CAMBIO CRÍTICO: Usamos 'action=borrar&codigo=' (según la consigna )
            fetch(`http://localhost/finalFebrero2026/proyecto/api_almacen/almacen_api.php?action=borrar&codigo=${cod}`)
                .then(response => {
                    if (response.status == 200) {
                        // 4. Mostramos el mensaje exacto pedido en el PDF [cite: 161]
                        contenedorMensajes.innerHTML = "eliminado";
                        
                        // 5. Refrescamos la tabla para ver el cambio
                        mostrarProducto();
                    } else {
                        contenedorMensajes.innerHTML = "Error al eliminar";
                    }
                })
                .catch(error => console.error("Error en la petición:", error));
        }
    } else {
        contenedorMensajes.innerHTML = "Ingrese un código válido en el formulario superior";
    }
}
});

