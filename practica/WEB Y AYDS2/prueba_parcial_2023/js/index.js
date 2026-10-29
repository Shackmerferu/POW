document.addEventListener('DOMContentLoaded', function () {
    const btnPaises = document.getElementById("paises");
    const btnProvincias = document.getElementById("provincias");
    const btnCiudades = document.getElementById("ciudades");
    const filtroInput = document.getElementById("filtroInput");

    const areaDisplay = document.getElementById("areaDisplay");
    const mapaModal = new bootstrap.Modal(document.getElementById('mapaModal'));
    const mapaIframe = document.getElementById('mapaIframe');
    const mapaModalLabel = document.getElementById('mapaModalLabel');

    const URL_API_BASE = 'paises/apipaises/route.php';

    // Variables para guardar el estado actual de la navegación y los datos
    let currentDataType = 'paises'; // 'paises', 'provincias', 'localidades'
    let currentData = []; // Aquí guardaremos los datos completos para poder filtrarlos
    let id_pais_actual = null;
    let nombre_pais_actual = null;
    let id_provincia_actual = null; // Para poder volver de localidades a provincias
    let nombre_provincia_actual = null; // Para poder volver de localidades a provincias
    let lat_provincia_actual = null; // (NUEVO) Para guardar lat de la provincia
    let lon_provincia_actual = null; // (NUEVO) Para guardar lon de la provincia

    btnPaises.addEventListener('click', function () {

        listarPaises();
    })
    btnProvincias.addEventListener('click', function () {
        if(id_pais_actual && nombre_pais_actual){
            listarProvincias(id_pais_actual, nombre_pais_actual);
        }else{
            listarPaises();
            alert('Por favor, selecciona un país primero para ver sus provincias.');
        }
        
    })
    btnCiudades.addEventListener('click', function () {
        
        if (id_provincia_actual && nombre_provincia_actual) {
            ListarLocalidades(id_provincia_actual, nombre_provincia_actual);
        } else if (id_pais_actual && nombre_pais_actual) {
            // Si hay un país pero no provincia, mostramos las provincias
            listarProvincias(id_pais_actual, nombre_pais_actual);
            alert('Por favor, selecciona una provincia primero para ver sus localidades.');
        } else {
            listarPaises();
            alert('Por favor, selecciona un país y luego una provincia para ver sus localidades.');
        }
    })


   function renderPaisesTable(paisesToRender) {
        let html = `<h3>Listado de países</h3>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-primary">
                                    <tr>
                                        <th>País</th>
                                        <th class="text-center">Ver Mapa</th>
                                        <th class="text-center">Provincias/Regiones</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                (paisesToRender || []).forEach(pais => {
                    html += `<tr>
                            <td>${pais.nombre}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-primary ver-mapa"
                                        data-nombre="${pais.nombre}"
                                        data-latitud="${pais.x}"
                                        data-longitud="${pais.y}"
                                        title="Ver mapa de ${pais.nombre}">
                                    <i class="bi bi-geo-alt-fill"></i>
                                </button>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-success ver-provincias-capital"
                                        data-pais-id="${pais.idPais}"
                                        data-nombre-pais="${pais.nombre}"
                                        title="Ver provincias de ${pais.nombre}">
                                    <i class="bi bi-list-nested"></i>
                                </button>
                            </td>
                         </tr>`;
                });

                html += `</tbody></table></div>`;
                areaDisplay.innerHTML = html;
                asignarEventosBotones(); // Re-asignar eventos después de renderizar
    }

    function renderProvinciasTable(provinciasToRender, nombrePais) {
        let html = `
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="mb-0">Provincias de: ${nombrePais}</h3>
                        <button class="btn btn-secondary btn-sm" id="btn-volver-paises">
                            <i class="bi bi-arrow-left"></i> Volver a Países
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-primary">
                                <tr>
                                    <th>Provincia/Región</th>
                                    <th class="text-center">Ver Mapa</th>
                                    <th class="text-center">Ciudades/Localidades</th>
                                </tr>
                            </thead>
                            <tbody>`;

                (provinciasToRender || []).forEach(provincia => {
                    html += `<tr>
                            <td>${provincia.nombre}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-primary ver-mapa"
                                        data-nombre="${provincia.nombre}"
                                        data-latitud="${provincia.x}"
                                        data-longitud="${provincia.y}"
                                        title="Ver mapa de ${provincia.nombre}">
                                    <i class="bi bi-geo-alt-fill"></i>
                                </button>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-success ver-localidades"
                                        data-provincia-id="${provincia.idProvincia}"
                                        data-nombre-provincia="${provincia.nombre}"
                                        title="Ver localidades de ${provincia.nombre}">
                                    <i class="bi bi-building"></i>
                                </button>
                            </td>
                         </tr>`;
                });

                html += `</tbody></table></div>`;
                areaDisplay.innerHTML = html;
                asignarEventosBotones(); // Re-asignar eventos después de renderizar
    }

    function renderLocalidadesTable(localidadesToRender, nombreProvincia) {
        let html = `
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="mb-0">Localidades de: ${nombreProvincia}</h3>
                        <button class="btn btn-secondary btn-sm" id="btn-volver-provincias">
                            <i class="bi bi-arrow-left"></i> Volver a Provincias
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-primary">
                                <tr>
                                    <th>Localidad/Ciudad</th>
                                    <th class="text-center">Ver Mapa</th>
                                </tr>
                            </thead>
                            <tbody>`;

                (localidadesToRender || []).forEach(localidad => {
                    html += `<tr>
                            <td>${localidad.nombre}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-primary ver-mapa"
                                        data-nombre="${localidad.nombre}"
                                        data-latitud="${localidad.x}"
                                        data-longitud="${localidad.y}"
                                        title="Ver mapa de ${localidad.nombre}">
                                    <i class="bi bi-geo-alt-fill"></i>
                                </button>
                            </td>
                         </tr>`;
                });

                html += `
            <div class="row mt-3">
                <div class="col-md-6">
                    <label for="filtroInicialLocalidad" class="form-label">Filtrar listado por inicial:</label>
                    <input type="text" id="filtroInicialLocalidad" class="form-control" placeholder="Ej: C">
                </div>
            </div>`;
                areaDisplay.innerHTML = html;
                asignarEventosBotones(); // Re-asignar eventos después de renderizar
    }

    function listarPaises() {
        areaDisplay.innerHTML = '<p class="text-center">Cargando países...</p>';
        filtroInput.value = ''; // Limpiar filtro al cambiar de vista
        
        id_pais_actual = null;
        nombre_pais_actual = null;
        id_provincia_actual = null;
        nombre_provincia_actual = null;
        currentDataType = 'paises';

        fetch(`http://localhost/prueba_parcial_2023/paises/apipaises/route.php?option=list_paises&order=nombre&order_dir=DESC`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.status != 200) {
                    console.error('Error al listar (API):', data);
                    areaDisplay.innerHTML = "<p>Error al cargar los países.</p>"
                    return;
                }
                currentData = data.paises; // Guardar los datos completos
                renderPaisesTable(currentData); // Renderizar con todos los datos
            })
            .catch(error => {
                console.error('Error al listar paises:', error);
                areaDisplay.innerHTML = `<div class="alert alert-danger text-center mt-4" role="alert">
                                        No se pudieron cargar los países. Revise la conexión.
                                    </div>`;
            })
    }

    function listarProvincias(idPais, nombrePais) {
        areaDisplay.innerHTML = `<p class="text-center">Cargando provincias de ${nombrePais}...</p>`;
        filtroInput.value = ''; // Limpiar filtro al cambiar de vista

        id_pais_actual = idPais;
        nombre_pais_actual = nombrePais;
        id_provincia_actual = null; // Resetear provincia actual al cambiar de país
        nombre_provincia_actual = null;
        currentDataType = 'provincias';

        fetch(`${URL_API_BASE}?option=list_provincias&idPais=${idPais}`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.status != 200) {
                    console.error('Error al listar provincias (API):', data);
                    areaDisplay.innerHTML = "<p>Error al cargar las provincias.</p>"
                    return;
                }
                currentData = data.data; // Guardar los datos completos
                renderProvinciasTable(currentData, nombrePais); // Renderizar con todos los datos
            })
            .catch(error => {
                console.error('Error al listar provincias:', error);
                areaDisplay.innerHTML = `<div class="alert alert-danger text-center mt-4" role="alert">
                                        No se pudieron cargar las provincias.
                                    </div>`;
            });
    }

    function listarLocalidades(idProvincia, nombreProvincia) {
        areaDisplay.innerHTML = `<p class="text-center">Cargando localidades de ${nombreProvincia}...</p>`;
        filtroInput.value = ''; // Limpiamos el filtro principal
        
        id_provincia_actual = idProvincia;
        nombre_provincia_actual = nombreProvincia;
        currentDataType = 'localidades';

        fetch(`${URL_API_BASE}?option=list_localidades&idProvincia=${idProvincia}`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.status != 200) { /* ... manejo de error ... */ return; }
                currentData = data.data;
                // Renderizar la tabla (que ahora tiene el nuevo formato)
                renderLocalidadesTable(currentData, nombreProvincia);
            })
            .catch(error => { /* ... manejo de error ... */ });
    }

    function mostrarMapa(nombre, latitud, longitud) {
        if(!longitud || !latitud || longitud == '0' || latitud == '0') {
            alert('No hay datos de ubicación para ' + nombre);
            return;
        }

        mapaModalLabel.textContent= `Mapa de ${nombre}`;
        mapaIframe.src= `https://maps.google.com/maps?q=${latitud},${longitud}&z=6&output=embed`;
        mapaModal.show();
    }

    filtroInput.addEventListener('input', function () {
        const texto = filtroInput.value.toLowerCase();
        let filteredData = [];

        if (currentData.length > 0) {
            filteredData = currentData.filter(item => {
                // Asumiendo que todos los elementos tienen una propiedad 'nombre'
                return item.nombre.toLowerCase().includes(texto);
            });
        }

        // Volvemos a renderizar la tabla con los datos filtrados
        if (currentDataType === 'paises') {
            renderPaisesTable(filteredData);
        } else if (currentDataType === 'provincias') {
            renderProvinciasTable(filteredData, nombre_pais_actual);
        } else if (currentDataType === 'localidades') {
            renderLocalidadesTable(filteredData, nombre_provincia_actual);
        }
    });

    // --- Función central para asignar eventos a todos los botones ---
    // La llamamos cada vez que redibujamos la tabla
    function asignarEventosBotones() {
        // Eventos para "Ver Mapa"
        document.querySelectorAll('.ver-mapa').forEach(boton => {
            boton.addEventListener('click', function () {
                const nombre = this.getAttribute('data-nombre');
                const latitud = this.getAttribute('data-latitud');
                const longitud = this.getAttribute('data-longitud');
                mostrarMapa(nombre, latitud, longitud);
            });
        });

        // Eventos para "Ver Provincias"
        document.querySelectorAll('.ver-provincias-capital').forEach(boton => {
            boton.addEventListener('click', function () {
                const id_pais = this.getAttribute('data-pais-id');
                const nombre_pais = this.getAttribute('data-nombre-pais');
                listarProvincias(id_pais, nombre_pais);
            });
        });

        // --- (MODIFICADO) Eventos para "Ver Localidades" ---
        document.querySelectorAll('.ver-localidades').forEach(boton => {
            boton.addEventListener('click', function () {
                // (NUEVO) Guardamos la lat/lon de la provincia seleccionada
                lat_provincia_actual = this.getAttribute('data-latitud');
                lon_provincia_actual = this.getAttribute('data-longitud');
                
                const id_provincia = this.getAttribute('data-provincia-id');
                const nombre_provincia = this.getAttribute('data-nombre-provincia');
                listarLocalidades(id_provincia, nombre_provincia);
            });
        });

        // Evento para "Volver a Países"
        const btnVolverPaises = document.getElementById('btn-volver-paises');
        if (btnVolverPaises) {
            btnVolverPaises.addEventListener('click', function() {
                listarPaises();
            });
        }

        // Evento para "Volver a Provincias"
        const btnVolverProvincias = document.getElementById('btn-volver-provincias');
        if (btnVolverProvincias) {
            btnVolverProvincias.addEventListener('click', function() {
                if (id_pais_actual && nombre_pais_actual) {
                    listarProvincias(id_pais_actual, nombre_pais_actual);
                } else {
                    listarPaises(); // Fallback
                }
            });
        }
        
        // (NUEVO) Evento para el filtro de iniciales de localidad
        const filtroInicial = document.getElementById('filtroInicialLocalidad');
        if (filtroInicial) {
            filtroInicial.addEventListener('input', filtrarLocalidadesPorInicial);
        }
    }

    function filtrarLocalidadesPorInicial(e) {
        const texto = e.target.value.toLowerCase();
        let filteredData = [];

        if (currentData.length > 0) {
            filteredData = currentData.filter(item => {
                // Filtra por inicial (o si está vacío)
                return item.nombre.toLowerCase().startsWith(texto);
            });
        }
        // Volvemos a renderizar solo la tabla de localidades
        renderLocalidadesTable(filteredData, nombre_provincia_actual);
    }

    function distanciaHaversine(lat1, lon1, lat2, lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 0; // Evitar cálculos con valores nulos
        }

        const PI = Math.PI;
        const Lat1 = parseFloat(lat1) * PI / 180;
        const Lon1 = parseFloat(lon1) * PI / 180;
        const Lat2 = parseFloat(lat2) * PI / 180;
        const Lon2 = parseFloat(lon2) * PI / 180;

        // Fórmula Haversine
        const R = 6378.137; // Radio de la Tierra en KM
        const dLat = Lat2 - Lat1;
        const dLon = Lon2 - Lon1;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(Lat1) * Math.cos(Lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const D = R * c; // Distancia en KM

        return D;
    }

    // Carga inicial al abrir la página
    listarPaises();
});
