/* ==================================================================
   index.js - VERSIÓN CORREGIDA Y COMPLETA
   ================================================================== */

// --- 1. GLOBALES ---
const API_URL = 'http://localhost/PARCIAL2025/la_tania/la_tania/api/';
let areaDisplay;
let Modal;
let ModalLabel;
let jugadoresMostrados = []; // Variable para guardar los jugadores

// --- 2. PUNTO DE ENTRADA ---
document.addEventListener('DOMContentLoaded', function(){
    
    // Inicializamos las variables globales ahora que el HTML existe
    areaDisplay = document.getElementById("areaDisplay");
    ModalLabel = document.getElementById('ModalLabel');
    
    // Creamos el objeto Modal UNA SOLA VEZ, aquí.
    Modal = new bootstrap.Modal(document.getElementById('Modal'));

    // Empezamos la aplicación cargando el menú.
    cargarMenu();
});

// --- 3. FUNCIONES DEL MENÚ ---

/**
 * Carga el menú dinámicamente desde la API.
 */
function cargarMenu() {
    const menuContainer = document.getElementById("menu-container");
    if (!menuContainer) {
        console.error("Error: No se encontró el #menu-container");
        return;
    }

    fetch(`${API_URL}menu.php`)
        .then(response => response.json())
        .then(data => {
            if (data.status != 200 || data.cantidad == 0) {
                menuContainer.innerHTML = "<p class='text-danger'>Error al cargar el menú.</p>";
                return;
            }

            const itemsVisibles = data.productos.filter(item => item.visible === 'SI');
            let menuHtml = '<div class="d-grid gap-2">';

            itemsVisibles.forEach(item => {
                let botonId = '';
                
                if (item.titulo.toLowerCase() === 'inico') {
                    botonId = 'inicio';
                } else if (item.id_categoria == 1) {
                    botonId = 'canicasMasculino';
                } else if (item.id_categoria == 3) {
                    botonId = 'canicasFemenino';
                }
                
                if (botonId) {
                    menuHtml += `
                        <button type="button" class="btn btn-info text-white fw-bold" id="${botonId}">
                            ${item.titulo.toUpperCase()}
                        </button>
                    `;
                }
            });
            
            // --- INICIO CÓDIGO PUNTO EXTRA "AGREGAR CLUB" ---
            // (Si no quieres el punto extra, puedes borrar este bloque)
            menuHtml += `
                <hr class="my-2">
                <button type="button" class="btn btn-success text-white fw-bold" id="btn-registrar-club">
                    + REGISTRAR CLUB (Extra)
                </button>
            `;
            // --- FIN CÓDIGO PUNTO EXTRA ---

            menuHtml += '</div>';
            menuContainer.innerHTML = menuHtml;

            inicializarBotonesMenu();

            if(document.getElementById('inicio')) {
                document.getElementById('inicio').click();
            }
        })
        .catch(error => {
            console.error('Error al cargar menú:', error);
            menuContainer.innerHTML = "<p class='text-danger'>Error de conexión con la API del menú.</p>";
        });
}

/**
 * Asigna los eventos de 'click' a los botones del menú.
 */
function inicializarBotonesMenu() {
    const btnInicio = document.getElementById("inicio");
    const btnCanicasMasculino = document.getElementById("canicasMasculino");
    const btnCanicasFemenino = document.getElementById("canicasFemenino");
    const btnRegistrarClub = document.getElementById("btn-registrar-club"); // Botón Extra
    
    if(btnInicio) {
        btnInicio.addEventListener('click', mostrarInicio);
    }
    if(btnCanicasMasculino) {
        btnCanicasMasculino.addEventListener('click', function(){
            listarJugadores(1, 'Canicas Masculino');
        });
    }
    if(btnCanicasFemenino) {
        btnCanicasFemenino.addEventListener('click', function(){
            listarJugadores(3, 'Canicas Femenino');
        });
    }
    // --- INICIO CÓDIGO PUNTO EXTRA "AGREGAR CLUB" ---
    if (btnRegistrarClub) {
        btnRegistrarClub.addEventListener('click', mostrarFormularioClub);
    }
    // --- FIN CÓDIGO PUNTO EXTRA ---
}

/**
 * Muestra el contenido de la página de inicio.
 */
function mostrarInicio() {
    areaDisplay.innerHTML = `
        <div>
            <div class="banner">
                <h1> EL MALEVO DEL VIDRIO </h1>
                <h2> EDMUNDO DANTES</h2>
                <p>1796 - 1826 (actualidad)</p>
            </div>
            <div class="textoBanner">
                <p>Club Deportivo La Tania – Tradición y Pasión en Movimiento...</p>
                </div>
        </div>`;
}

// --- 4. FUNCIONES DE JUGADORES Y MODAL ---

/**
 * Busca los jugadores por categoría y luego carga la tabla de posiciones.
 */
function listarJugadores(idCategoria, titulo) {
    fetch(`${API_URL}jugadores.php?id_categoria=${idCategoria}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.status != 200 || data.cantidad == 0) {
                areaDisplay.innerHTML = `<h3 class="mb-3">${titulo}</h3><p>No se encontraron jugadores.</p>`;
            } else {
                mostrarTodosLosJugadores(data.productos, titulo);
            }
            // Siempre cargamos la tabla, haya jugadores o no
            cargarTablaDePosiciones(idCategoria);
        })
        .catch(error => {
            console.error('Error al listar jugadores:', error);
            areaDisplay.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
        });
}

/**
 * Genera el HTML de la tabla de jugadores.
 * (Esta versión corrige el HTML roto y usa 'id_jugador')
 */
function mostrarTodosLosJugadores(jugadores, titulo) {
    jugadoresMostrados = jugadores; // Guardamos los jugadores
    
    let html = `<h3 class="mb-3">${titulo}</h3>`;
    html += `<div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark"> 
                        <tr>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Apodo</th>
                            <th class="text-center">Acción</th>
                        </tr>
                    </thead>
                <tbody>`;

    jugadores.forEach(p => {
        const fotoURL = `${API_URL}/img/fotos_jugadores/${p.imagen}`; 
        
        html += `<tr>
                    <td><img src="${fotoURL}" alt="${p.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%;"></td>
                    <td>${p.nombre}</td>
                    <td>${p.apellido}</td>
                    <td>${p.apodo}</td>
                    <td class="text-center">
                        <button class="btn btn-info btn-sm ver-detalle"
                                data-jugador-id="${p.id_jugador}">
                            Ver Más
                        </button>
                    </td>
                </tr>`;
    });
    
    html += `</tbody></table></div>`;
    areaDisplay.innerHTML = html;
    
    asignarEventosBotonesDetalle();
}

/**
 * Asigna los eventos 'click' a los botones "Ver Más" de la tabla.
 * (Esta versión lee 'data-jugador-id' y busca por 'id_jugador')
 */
function asignarEventosBotonesDetalle() {
    document.querySelectorAll('.ver-detalle').forEach(boton => {
        boton.addEventListener('click', function () {
            
            const id = this.getAttribute('data-jugador-id');
            const jugador = jugadoresMostrados.find(j => j.id_jugador == id);

            if(jugador){
                mostrarInfo(jugador); // Enviamos el objeto jugador completo
            }else{
                console.error("No se encontró el jugador con id:", id);
            }
        });
    });
}

/**
 * Muestra la modal con la info del jugador y el formulario de palmarés.
 * (Esta es la versión COMPLETA que incluye la lógica de GUARDAR)
 */
function mostrarInfo(jugador) { 
    
    // 1. Declaramos variables ANTES de usarlas
    const nombre = `${jugador.apellido}, ${jugador.nombre}`;
    const apodo = jugador.apodo;
    const biografia = jugador.biografia;
    const dni = jugador.dni;
    const fotoURL = `${API_URL}/img/fotos_jugadores/${jugador.imagen}`;

    // 2. Ponemos el contenido estático y el FORMULARIO
    ModalLabel.textContent = `${nombre} (${apodo})`;
    const modalBody = document.querySelector('#Modal .modal-body');
    
    modalBody.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-md-4">
                    <img src="${fotoURL}" alt="${nombre}" class="img-fluid rounded">
                </div>
                <div class="col-12 col-md-8">
                    <h4>Biografía</h4>
                    <p>${biografia}</p>
                </div>
            </div>
            <hr>
            <h4>Trayectoria (Palmarés)</h4>
            <div id="lista-palmares"><p>Cargando trayectoria...</p></div>

            <hr>
            <h5>Agregar Trayectoria al palmares</h5>
            <div class="mb-3">
                <textarea id="nuevoPalmares" class="form-control" rows="3" placeholder="Escriba el nuevo hito..."></textarea>
                <button id="btnAgregarPalmares" class="btn btn-primary mt-2" data-dni="${dni}">Agregar</button>
                <div id="guardarPalmaresFeedback" class="mt-2"></div>
            </div>
        </div>
    `;

    // 3. Mostramos la modal
    Modal.show();

    // 4. Función interna para refrescar la lista
    function refrescarPalmares() {
        fetch(`${API_URL}palmares_listar.php?dni=${dni}`) // Llama a 'listar'
            .then(response => response.json())
            .then(data => {
                const divPalmares = document.getElementById('lista-palmares');
                if (!divPalmares) return; 

                if (data.status != 200 || data.cantidad == 0) {
                    divPalmares.innerHTML = "<p>Este jugador no tiene una trayectoria registrada.</p>";
                    return;
                }
                let htmlPalmares = `
                    <table class="table table-sm table-striped">
                        <thead class="table-dark">
                            <tr><th>Año</th><th>Detalle</th></tr>
                        </thead>
                        <tbody>
                `;
                data.productos.forEach(p => {
                    htmlPalmares += `<tr><td>${p.anio}</td><td>${p.detalle}</td></tr>`;
                });
                htmlPalmares += `</tbody></table>`;
                divPalmares.innerHTML = htmlPalmares;
            })
            .catch(error => {
                console.error('Error al cargar palmarés:', error);
                const divPalmares = document.getElementById('lista-palmares');
                if(divPalmares) {
                    divPalmares.innerHTML = "<p class='text-danger'>No se pudo cargar la trayectoria.</p>";
                }
            });
    }

    // 5. Asignamos el Event Listener para "Agregar"
    document.getElementById('btnAgregarPalmares').addEventListener('click', function() {
        const detalle = document.getElementById('nuevoPalmares').value;
        const feedback = document.getElementById('guardarPalmaresFeedback');

        if (detalle.trim() === "") {
            feedback.innerHTML = "<p class='text-danger'>El detalle no puede estar vacío.</p>";
            return;
        }

        feedback.innerHTML = "<p class='text-info'>Guardando...</p>";

        const formData = new URLSearchParams();
        formData.append('dni', dni);
        formData.append('detalle', detalle);

        // Hacemos el fetch a palmares_guardar.php
        fetch(`${API_URL}palmares_guardar.php`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                feedback.innerHTML = "<p class='text-success'>Guardado con éxito.</p>";
                document.getElementById('nuevoPalmares').value = '';
                refrescarPalmares(); // Refrescamos la lista
            } else {
                feedback.innerHTML = `<p class='text-danger'>Error al guardar: ${data.message}</p>`;
            }
        })
        .catch(error => {
            feedback.innerHTML = "<p class='text-danger'>Error de conexión.</p>";
        });
    });

    // 6. Cargamos la lista de palmarés por primera vez
    refrescarPalmares();
}


// --- 5. FUNCIONES DE TABLA DE POSICIONES ---

/**
 * Función principal para cargar y mostrar la tabla de posiciones.
 */
async function cargarTablaDePosiciones(idCategoria) {
    const contenedorTabla = document.createElement('div');
    contenedorTabla.id = `tabla-posiciones-${idCategoria}`;
    contenedorTabla.innerHTML = `
        <hr class="my-4">
        <h3 class="mb-3">Tabla de Posiciones</h3>
        <p>Calculando puntos...</p>
    `;
    areaDisplay.appendChild(contenedorTabla);

    try {
        const responseEquipos = await fetch(`${API_URL}equipos.php`);
        const dataEquipos = await responseEquipos.json();

        if (dataEquipos.status != 200) {
            contenedorTabla.innerHTML = "<p class'text-danger'>Error al cargar equipos.</p>";
            return;
        }

        let equipos = dataEquipos.productos;
        
        const promesasPartidos = equipos.map(equipo => {
            return calcularPuntosParaEquipo(equipo, idCategoria);
        });

        const equiposConPuntos = await Promise.all(promesasPartidos);
        equiposConPuntos.sort((a, b) => b.puntos - a.puntos);
        mostrarTablaHTML(equiposConPuntos, contenedorTabla);

    } catch (error) {
        console.error("Error al cargar tabla de posiciones:", error);
        contenedorTabla.innerHTML = "<p class='text-danger'>No se pudo calcular la tabla.</p>";
    }
}

/**
 * Calcula los puntos totales para un solo equipo.
 */
async function calcularPuntosParaEquipo(equipo, idCategoria) {
    const urlLocal = `${API_URL}partidos.php?localia=A&id_equipo=${equipo.id_equipo}&id_categoria=${idCategoria}`;
    const urlVisitante = `${API_URL}partidos.php?localia=B&id_equipo=${equipo.id_equipo}&id_categoria=${idCategoria}`;

    const [responseLocal, responseVisitante] = await Promise.all([
        fetch(urlLocal),
        fetch(urlVisitante)
    ]);

    const dataLocal = await responseLocal.json();
    const dataVisitante = await responseVisitante.json();

    let puntos = 0;

    if (dataLocal.status == 200) {
        dataLocal.productos.forEach(partido => {
            if (partido.puntos_A > partido.puntos_B) {
                puntos += (partido.modalidad === 'C1') ? 3 : 5;
            } else if (partido.puntos_A == partido.puntos_B) {
                puntos += (partido.modalidad === 'C1') ? 1 : 2;
            }
        });
    }

    if (dataVisitante.status == 200) {
        dataVisitante.productos.forEach(partido => {
            if (partido.puntos_B > partido.puntos_A) {
                puntos += (partido.modalidad === 'C1') ? 3 : 5;
            } else if (partido.puntos_A == partido.puntos_B) {
                puntos += (partido.modalidad === 'C1') ? 1 : 2;
            }
        });
    }
    
    return { ...equipo, puntos: puntos };
}

/**
 * Genera el HTML final de la tabla y lo muestra.
 */
function mostrarTablaHTML(equipos, contenedor) {
    let html = `<div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark"> 
                            <tr>
                                <th>Logo</th>
                                <th>Equipo</th>
                                <th>Puntos</th>
                            </tr>
                        </thead>
                    <tbody>`;

    equipos.forEach(e => {
        const logoURL = `${API_URL}/img/logos/${e.logo}`;
        html += `<tr>
                    <td><img src="${logoURL}" alt="${e.nombre}" style="width: 40px; height: 40px;"></td>
                    <td>${e.nombre}</td>
                    <td>${e.puntos}</td>
                </tr>`;
    });

    html += `</tbody></table></div>`;
    contenedor.innerHTML = html;
}


// --- 6. FUNCIONES DEL PUNTO EXTRA (AGREGAR CLUB) ---

/**
 * Muestra el formulario para registrar un nuevo club en el areaDisplay.
 */
function mostrarFormularioClub() {
    areaDisplay.innerHTML = `
        <h3 class="mb-3">Registrar Nuevo Equipo (Punto Extra)</h3>
        <div class="panelDisplay p-4 border rounded">
            <form id="form-nuevo-club">
                <div class="mb-3">
                    <label for="club-nombre" class="form-label">Nombre del Club:</label>
                    <input type="text" class="form-control" id="club-nombre" name="nombre" required>
                </div>
                <div class="mb-3">
                    <label for="club-logo" class="form-label">Logo del Club:</label>
                    <input type="file" class="form-control" id="club-logo" name="logo" accept="image/png, image/jpeg" required>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Equipo</button>
            </form>
            <div id="club-feedback" class="mt-3"></div>
        </div>
    `;

    document.getElementById('form-nuevo-club').addEventListener('submit', function(e) {
        e.preventDefault(); 

        const feedback = document.getElementById('club-feedback');
        const form = e.target;
        const formData = new FormData(form);

        feedback.innerHTML = "<p class='text-info'>Enviando datos...</p>";

        fetch(`${API_URL}equipos_insertar.php`, {
            method: 'POST',
            body: formData 
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                feedback.innerHTML = `<p class='text-success'>¡Éxito! ${data.message}</p>`;
                form.reset(); 
            } else {
                feedback.innerHTML = `<p class='text-danger'>Error: ${data.message}</p>`;
            }
        })
        .catch(error => {
            feedback.innerHTML = "<p class='text-danger'>Error de conexión con la API.</p>";
        });
    });
}