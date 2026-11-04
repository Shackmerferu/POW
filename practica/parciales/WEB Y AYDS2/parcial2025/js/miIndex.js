const API_URL = 'http://localhost/PARCIAL2025/la_tania/la_tania/api/';
function inicializarBotones() {
    const btnInicio = document.getElementById("inicio");
    const btnCanicasMasculino = document.getElementById("canicasMasculino");
    const btnCanicasFemenino = document.getElementById("canicasFemenino");
    const btnVerEquipos = document.getElementById("equipos")
    const areaDisplay = document.getElementById("areaDisplay");


    const Modal = new bootstrap.Modal(document.getElementById('Modal'));

    const ModalLabel = document.getElementById('ModalLabel');

    btnInicio.addEventListener('click', function () {
        areaDisplay.innerHTML = `<div>
                                    <div class="banner">
                                        
                                        <h1> EL MALEVO DEL VIDRIO </h1>
                                        <h2> EDMUNDO DANTES</h2>
                                        <p>1796 - 1826 (actualidad)</p>
                                    </div>
                                    <div class="textoBanner">
                                        <p>Club Deportivo La Tania – Tradición y Pasión en Movimiento
                                            Fundado en el corazón de General Pico, el Club Deportivo La Tania se ha consolidado como un espacio de encuentro, comunidad y deporte para todas las edades. Desde sus inicios, el club ha promovido la práctica deportiva como una forma de integración social y bienestar, albergando disciplinas como fútbol, bochas, ajedrez y atletismo.
                                            Sin embargo, el deporte por excelencia de La Tania son las Canicas, una tradición que ha trascendido generaciones y se ha convertido en sello de identidad del club siendo su máximo referente Edmundo Dantés. En sus canchas especialmente diseñadas, socios y visitantes disfrutan de competencias amistosas y torneos locales que combinan destreza, estrategia y compañerismo.
                                            Más que un club, La Tania es un punto de encuentro para quienes valoran la historia, el juego y la amistad, manteniendo vivo el espíritu deportivo en cada partida de canicas.
                                        </p>
                                    </div>
                                </div>`
    })

    btnCanicasMasculino.addEventListener('click', function () {
        //a listar en el parcial pedia que le pasemos id_categoria=1 para masculino
        listarJugadores(1, 'canicas masculino');
    })

    btnCanicasFemenino.addEventListener('click', function () {
        //a listar en el parcial pedia que le pasemos id_categoria=3 para femenino
        listarJugadores(3, 'canicas femenino');
    })

    //FUNCION INNECESARIA PARA EL PARCIAL///////////// pero igual la hago
    btnVerEquipos.addEventListener('click', function () {
        listarEquipos();
    })

    function listarEquipos() {
        fetch(`${API_URL}equipos.php`)
            .then(response => response.json())
            .then(data => {
                if (!data.status) {
                    areaDisplay.innerHTML = '<h3 class="mb-3">Asignar equipos</h3><p>No se encontraron equipos</p>';
                    return;
                }
                mostrarTodosLosEquipos(data.productos, 'Equipos');
            })
    }
    ////////////////////////////////////////////////////

    //La funcion ahora recibe un id_categoria y un titulo
    function listarJugadores(id_categoria, titulo) {
        //estafuncion estaba mal ya que no le pasaba ningun id
        /*fetch(`${API_URL}jugadores.php`)*/
        //la que sigue es la correcta:
        fetch(`${API_URL}jugadores.php?id_categoria=${id_categoria}`)

            .then(response => response.json())
            .then(data => {
                if (!data || data.status != 200) {
                    console.error('Error al listar (API):', data);
                    areaDisplay.innerHTML = "<p>Error al cargar los jugadores.</p>"
                    return;
                }
                //aca lo que tenia mal es que yo le pasaba data, pero data no tenia los jugadores
                //tenia que pasar data.productos porque ahi estaban los jugadores
                /*mostrarTodosLosJugadores(data, 'Todos los Jugadores');*/
                mostrarTodosLosJugadores(data.productos, titulo);

            })
            .catch(error => {
                console.error('Error al listar todos los jugadores:', error);
                areaDisplay.innerHTML = '<p class="text-danger">Error al cargar los datos.</p>';
            });


    }

    function mostrarTodosLosEquipos(equipos, titulo) {
        if (!equipos || equipos.length == 0) {
            areaDisplay.innerHTML = `<h3 class="mb-3">${titulo}</h3><p>No se encontraron equipos.</p>`;
            return;
        }

        let html = `<h2 class="mb-3">${titulo}</h3>`;
        html += `<div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark"> 
                            <tr>
                                <th>Logo</th>
                                <th>Nombre</th>
                                <th>Puntos</th>
                            </tr>
                        </thead>
                    <tbody>`;
        equipos.forEach(p => {
            html += `<tr>
                        <th><img src="${API_URL}/img/logos/${p.logo}" alt="${p.nombre}"></th>
                        <td>${p.nombre}</td>
                        <td>${p.puntos}</td>
                    </tr>`;
        })
        html += `</tbody></table></div>`;
        areaDisplay.innerHTML = html;
    }

    function mostrarTodosLosJugadores(jugadores, titulo) {
        if (!jugadores || jugadores.length == 0) {
            areaDisplay.innerHTML = `<h3 class="mb-3">${titulo}</h3><p>No se encontraron jugadores.</p>`;
            return;
        }
        let html = `<h3 class="mb-3">${titulo}</h3>`;
        html += `<div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark"> 
                            <tr>
                                <th>Foto</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th> + Info </th>
                            </tr>
                        </thead>
                    <tbody>`;

        // CORRECCIÓN: El enunciado pedía un diseño tipo "cards" [cite: 114-123], pero
        // ya que usaste una tabla, la corregimos para que funcione.
        jugadores.forEach(p => {
            html += `<tr>
                        <th><img src="${API_URL}/img/fotos_jugadores/${p.imagen}" alt="${p.nombre} ${p.apellido}"></th>
                        <td>${p.nombre}</td>
                        <td>${p.apellido}</td>
                        <td>
                            <button class="btn btn-info btn-sm ver-detalle"
                                data-jugador-nombre= '${p.nombre}, ${p.apellido}'
                                data-apodo-jugador = '${p.apodo}'
                                data-jugador-bio='${p.biografia}'
                                data-foto-jugador='${p.imagen}'>
                                Ver Mas
                            </button>
                        </td>
                    </tr>`;
        });
        html += `</tbody></table></div>`;
        areaDisplay.innerHTML = html;
        asignarEventosBotones();
    }

    function asignarEventosBotones() {
        document.querySelectorAll('.ver-detalle').forEach(boton => {
            boton.addEventListener('click', function () {
                const biografia = this.getAttribute('data-jugador-bio');
                const apodo = this.getAttribute('data-apodo-jugador');
                const foto = this.getAttribute('data-foto-jugador');
                const nombreCompleto = this.getAttribute('data-jugador-nombre');
                mostrarInfo(nombreCompleto, apodo, biografia, foto);
                //aca no llegue y bueno la idea era esta mostrar la info en un modal
            });
        });
    }

    function mostrarInfo(NombreCompleto, apodo, biografia, foto) {
        // Pone el contenido correctamente en el modal y lo muestra
        ModalLabel.innerHTML = `${NombreCompleto} <br><small class="text-muted">${apodo}</small>`;

        const modalBody = document.querySelector('#Modal .modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
            <div class="d-flex">
                <img src="${API_URL}/img/fotos_jugadores/${foto}" alt="${NombreCompleto}" class="img-fluid me-3" style="max-width:150px;">
                <div>
                <p>${biografia}</p>
                </div>
            </div>
            `;
        }

        Modal.show();
    }



    if (btnInicio) {
        btnInicio.addEventListener('click', function () {
            areaDisplay.innerHTML = `<div></div>`;
        });
    }




}

//////////////////////lo que tendria que haber hecho en menu


function mostrarMenu() {
    const menuContainer = document.getElementById('menu-container');

    fetch(`${API_URL}menu.php`)
        .then(response => response.json())
        .then(data => {
            if (data.status != 200) {
                menuContainer.innerHTML = '<p>Error al cargar el menú.</p>';
                return;
            }
            const botones = data.productos.filter(p => p.visible == 'SI');
            let menuhtml = '<div class="d-grid gap-2">'

            botones.forEach(p => {
                let botonId = '';

                if (p.titulo.toLowerCase() == 'inicio') {
                    botonId = 'inicio';
                } else if (p.id_categoria == 1) {
                    botonId = 'canicasMasculino';
                } else if (p.id_categoria == 3) {
                    botonId = 'canicasFemenino';
                }

                if (botonId) {
                    menuhtml += `<button id="${botonId}" type="button" class="btn btn-info text-white fw-bold"> 
                ${p.titulo.toLowerCase()}</button>`;
                }
            });
            menuhtml += '</div>';
            menuContainer.innerHTML = menuhtml;

            //ahora hay que darle funcionalidad a los botones creados dinamicamente
            inicializarBotones();

            // Adicional: Hacemos que la página de inicio cargue por defecto
            document.getElementById('inicio').click();
        })
        .catch(error => {
            console.error('Error al cargar menú:', error);
            menuContainer.innerHTML = "<p class='text-danger'>Error al conectar con la API del menú.</p>";
        });

}

document.addEventListener('DOMContentLoaded', function () {
    // 2.1. Inicializamos las variables globales ahora que el HTML existe
    areaDisplay = document.getElementById("areaDisplay");
    ModalLabel = document.getElementById('ModalLabel');

    // 2.2. ¡AQUÍ ESTÁ LA CORRECCIÓN!
    // Creamos el objeto Modal UNA SOLA VEZ, aquí.
    // Ahora que el DOM cargó, Bootstrap puede encontrar el 'id="Modal"'.
    Modal = new bootstrap.Modal(document.getElementById('Modal'));
    mostrarMenu();
});
// Declaramos las variables principales. Las inicializaremos
// después de que cargue el DOM.
let areaDisplay;
let Modal;
let ModalLabel;