document.addEventListener('DOMContentLoaded', function () {
    const idRecolector = localStorage.getItem("id_recolector");

    if (!idRecolector) {
        window.location.href = "index.html";
        console.log("Usuario no registrado, redirigiendo...");
        return;
    }

    console.log("usuario registrado");

    const btnAsignarme = document.getElementById("asignarme");
    const btnVerAsignados = document.getElementById("verAsignados");
    const btnTodosClientes = document.getElementById("todosClientes");
    const btnSalir = document.getElementById("salir");
    const areaDisplay = document.getElementById("areaDisplay");
    const API_BASE_URL = 'backend/';

    const mapaModal = new bootstrap.Modal(document.getElementById('mapaModal'));
    const mapaIframe = document.getElementById('mapaIframe');
    const mapaModalLabel = document.getElementById('mapaModalLabel');

    btnSalir.addEventListener("click", function (event) {
        event.preventDefault();

        if (confirm("estas seguro de querer salir?")) {
            localStorage.removeItem("id_recolector");
            alert("Sesion cerrada correctamente");
            window.location.href = "index.html";

        }
    });


    btnAsignarme.addEventListener("click", function () {
        areaDisplay.innerHTML = "<p>Obteniendo tu ubicacion...<p>";

        if (!navigator.geolocation) {
            areaDisplay.innerHTML = "<p> El navegador no soporta la geolocalizacion<p>";
            return;
        }

        navigator.geolocation.getCurrentPosition(function (position) {
            const recolectorLat = position.coords.latitude;
            const recolectorLon = position.coords.longitude;
            areaDisplay.innerHTML = "<p> Ubicacion obtenida, buscando clientes pendientes...<p>";

            fetch(`${API_BASE_URL}listar_cliente.php?estado=P`)
                .then(response => response.json())
                .then(clientes => {
                    if (!Array.isArray(clientes) || clientes.length === 0) {
                        areaDisplay.innerHTML = '<h3 class="mb-3">Asignar Clientes</h3><p>No se encontraron clientes pendientes.</p>';
                        return;
                    }

                    const clienteDistancias = clientes.map(cliente => {
                        const [clienteLat, clienteLon] = cliente.latlong.split(',').map(Number);
                        const distancia = getDistanciaKm(recolectorLat, recolectorLon, clienteLat, clienteLon);
                        return { ...cliente, distancia_km: distancia };


                    });

                    clienteDistancias.sort((a, b) => a.distancia_km - b.distancia_km);
                    const clientesCercanos3 = clienteDistancias.slice(0, 3);
                    mostrarClientesEnArea(clientesCercanos3);
                })
                .catch(error => {
                    console.error('Error al listar clientes:', error);
                    areaDisplay.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
                });
        }, function (error) {
            areaDisplay.innerHTML = `<p class="text-danger">Error al obtener tu ubicación: ${error.message}</p>`;
        });
    });

    btnVerAsignados.addEventListener("click", function () {
        areaDisplay.innerHTML = "<p>Cargando clientes asignados...</p>";

        const p1 = fetch(`${API_BASE_URL}listar_cliente_recolector.php?id_recolector=${idRecolector}`)
            .then(response => response.json());

        const p2 = fetch(`${API_BASE_URL}listar_cliente.php`)
            .then(response => response.json());

        Promise.all([p1, p2])
            .then(([asignaciones, clientes]) => {

                if (!Array.isArray(asignaciones) || asignaciones.length == 0) {
                    areaDisplay.innerHTML = '<h3 class="mb-3">Mis Clientes Asignados</h3><p>No tienes clientes asignados.</p>';
                    return;
                }

                const clientesMap = new Map(clientes.map(cliente => [cliente.id, cliente]));
                const datosCompletos = asignaciones.map(asign => {
                    const cliente = clientesMap.get(asign.id_cliente);
                    if (cliente) {
                        // Combinamos datos del cliente (nombre, email, latlong)
                        // con el estado de la asignación (A, F, T)
                        return {
                            ...cliente, // Trae nombre, apellido, email, latlong, etc.
                            estado_asignacion: asign.estado // Agrega el estado real
                        };
                    }
                    return null;
                }).filter(Boolean); //fuera nulos
                mostrarMisAsignaciones(datosCompletos);
            })
            .catch(error => {
                console.error('Error al listar mis asignaciones:', error);
                areaDisplay.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
            });
    });

    btnTodosClientes.addEventListener("click", function () {
        areaDisplay.innerHTML = '<p>Cargando todos los clientes...</p>';
        fetch(`${API_BASE_URL}listar_cliente.php`)
            .then(response => response.json())
            .then(clientes => {
                mostrarTodosLosClientes(clientes, 'Todos los Clientes');
            })
            .catch(error => {
                console.error('Error al listar todos los clientes:', error);
                areaDisplay.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
            });
    });

    function mostrarClientesEnArea(clientes) {
        let html = `<h3 class="mb-3">Clientes Pendientes (Top 3 más cercanos)</h3>`;
        html += `<div class="table-responsive"><table class="table table-striped table-hover"><thead class="table-info"><tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Email</th><th>Distancia (km)</th><th>Acción</th></tr></thead><tbody>`;
        clientes.forEach(cliente => {
            html += `<tr><td>${cliente.nombre}</td><td>${cliente.apellido}</td><td>${cliente.telefono}</td><td>${cliente.email}</td><td>${cliente.distancia_km.toFixed(2)}</td><td class="bg-success-subtle"><button class="btn btn-success btn-sm fw-bold" onclick="asignarCliente(${cliente.id}, ${cliente.distancia_km})">Asignar</button></td></tr>`;
        });
        html += `</tbody></table></div>`;
        areaDisplay.innerHTML = html;
    }


    function mostrarMisAsignaciones(datosCompletos) {
        let html = `<h3 class="mb-3">Mis Asignaciones</h3>`;
        html += `<div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-primary">
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>`;
        datosCompletos.forEach(cliente => {
            html += `<tr>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.estado_asignacion}</td>
                         <td class="bg-success-subtle">
                            <button class="btn btn-primary btn-sm fw-bold" 
                                    onclick="verMapa('${cliente.latlong}', '${cliente.nombre} ${cliente.apellido}')">
                                ver mapa
                            </button>
                        </td>
                    </tr>`;
        });
        html += `</tbody></table></div>`;
        areaDisplay.innerHTML = html;
    }

    function mostrarTodosLosClientes(clientes, titulo) {
        if (!Array.isArray(clientes) || clientes.length === 0) {
            areaDisplay.innerHTML = `<h3 class="mb-3">${titulo}</h3><p>No se encontraron clientes.</p>`;
            return;
        }
        let html = `<h3 class="mb-3">${titulo}</h3>`;
        html += `<div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark"> 
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Estado (Gral)</th>
                            </tr>
                        </thead>
                    <tbody>`;
        clientes.forEach(cliente => {
            // El 'estado' aquí es el general (P), no el de tu asignación
            html += `<tr>
                        <td>${cliente.id}</td>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.estado}</td>
                    </tr>`;
        });
        html += `</tbody></table></div>`;
        areaDisplay.innerHTML = html;
    }

    /*funcion de distancia*/
    function getDistanciaKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en km
        const Rad = (value) => (value * Math.PI) / 180;
        const dLat = Rad(lat2 - lat1);
        const dLon = Rad(lon2 - lon1);
        const rLat1 = Rad(lat1);
        const rLat2 = Rad(lat2);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    window.asignarCliente = function (id_cliente, distancia_km) {
        const kmRecorridos = Math.round(distancia_km);

        if (confirm(`¿Asignarte el cliente ID: ${id_cliente}? (Distancia: ${kmRecorridos} km)`)) {
            areaDisplay.innerHTML = `<p>Asignando cliente ${id_cliente}, por favor espere...</p>`;

            fetch(`${API_BASE_URL}guardar_cliente_recolector.php?id_cliente=${id_cliente}&id_recolector=${idRecolector}&estado=A`)
                .then(response => response.json())
                .then(data1 => {
                    if (data1.status !== 200) {
                        throw new Error(data1.message || "Error al guardar cliente");
                    }
                    return fetch(`${API_BASE_URL}actualiza_cliente.php?id_cliente=${id_cliente}&estado=A`);
                })
                .then(response => response.json())
                .then(data2 => {
                    if (data2.status !== 200) {
                        throw new Error(data2.message || "Error al actualizar estado del cliente");
                    }
                    return fetch(`${API_BASE_URL}actualiza_recolector.php?id_recolector=${idRecolector}&km_recorrido=${kmRecorridos}`);
                })
                .then(response => response.json())
                .then(data3 => {
                    if (data3.status !== 200) {
                        throw new Error(data3.message || "Error al actualizar km del recolector");
                    }
                    alert("Cliente asignado correctamente.");
                    btnAsignarme.click(); // Refrescar la lista de clientes
                })
                .catch(error => {
                    console.error('Error en el proceso de asignación:', error);
                    alert(`Error al asignar: ${error.message}`);
                    btnAsignarme.click();
                });
        }
    }

     // --- AÑADIDO: Función para mostrar el mapa ---
    window.verMapa = (latlong, nombreCliente) => {
        if (!latlong || latlong.split(',').length !== 2) {
            alert('Error: El cliente no tiene una ubicación válida.');
            return;
        }

        const [lat, lon] = latlong.split(',');
        const url = `https://maps.google.com/maps?q=${lat},${lon}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

        mapaIframe.src = url;
        mapaModalLabel.textContent = `Ubicación de: ${nombreCliente}`;
        
        mapaModal.show();
    }



});