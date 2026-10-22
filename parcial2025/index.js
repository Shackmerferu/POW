const nav = document.getElementById('nav');
const tarjetas = document.getElementById('tarjetas');

function crearMenu() {
    fetch('http://localhost/parcial20252/la_tania/la_tania/api/menu.php')
        .then(response => response.json())
        .then(data => {

            data.productos.forEach(element => {
                if (element.visible == 'SI') {

                    const enlase = document.createElement('a');
                    enlase.textContent = element.titulo;
                    enlase.href = `${element.src}?id_categoria=${element.id_categoria}`;

                    nav.appendChild(enlase);
                }

            });
        })
}

async function crearTabla() {
    const contenedor = document.getElementById('tabla');
    contenedor.innerHTML = '';

    const resEquipos = await fetch('http://localhost/parcial20252/la_tania/la_tania/api/equipos.php');
    const dataEquipos = await resEquipos.json();

    const table = document.createElement('table');
    const header = document.createElement('tr');
    header.innerHTML = `
        <th>Escudo</th>
        <th>Nombre</th>
        <th>Puntos</th>
    `;
    table.appendChild(header);

    // recorremos los equipos
    for (const element of dataEquipos.productos) {
        let sumadorA = 0;

        // ejecutamos ambas peticiones en paralelo
        const [resA, resB] = await Promise.all([
            fetch(`http://localhost/parcial20252/la_tania/la_tania/api/partidos.php?localia=A&id_equipo=${element.id_equipo}&id_categoria=1`),
            fetch(`http://localhost/parcial20252/la_tania/la_tania/api/partidos.php?localia=B&id_equipo=${element.id_equipo}&id_categoria=1`)
        ]);

        const dataA = await resA.json();
        const dataB = await resB.json();

        // partidos como local
        dataA.productos.forEach(partido => {
            if (parseInt(partido.puntos_A) > parseInt(partido.puntos_B)) {
                sumadorA += partido.modalidad === 'C1' ? 3 : 5;
            } else if (parseInt(partido.puntos_A) === parseInt(partido.puntos_B)) {
                sumadorA += partido.modalidad === 'C1' ? 1 : 2;
            }
        });

        // partidos como visitante
        dataB.productos.forEach(partido => {
            if (parseInt(partido.puntos_B) > parseInt(partido.puntos_A)) {
                sumadorA += partido.modalidad === 'C1' ? 3 : 5;
            } else if (parseInt(partido.puntos_B) === parseInt(partido.puntos_A)) {
                sumadorA += partido.modalidad === 'C1' ? 1 : 2;
            }
        });

        // crear fila
        const fila = document.createElement('tr');
        const img = document.createElement('img');
        img.src = `http://localhost/parcial20252/la_tania/la_tania/api/img/logos/${element.logo}`;
        img.width = 50; // tamaño razonable

        const tdImg = document.createElement('td');
        tdImg.appendChild(img);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = element.nombre;

        const tdPuntos = document.createElement('td');
        tdPuntos.textContent = sumadorA;

        fila.appendChild(tdImg);
        fila.appendChild(tdNombre);
        fila.appendChild(tdPuntos);
        table.appendChild(fila);
    }

    contenedor.appendChild(table);
}

function crearPagina(id_categoria) {

    fetch(`http://localhost/parcial20252/la_tania/la_tania/api/jugadores.php?id_categoria=${id_categoria}`)
        .then(response => response.json())
        .then(data => {

            data.productos.forEach(element => {
                const div = document.createElement('div');
                const a = document.createElement('a');
                const p = document.createElement('p');
                const img = document.createElement('img');

                a.textContent = "Ver mas";
                a.href = "#";

                img.src = `http://localhost/parcial20252/la_tania/la_tania/api/img/fotos_jugadores/${element.imagen}`;

                p.textContent = element.nombre + element.apellido;

                a.addEventListener('click', () => {
                    abrirModal(element);
                })

                div.appendChild(img);
                div.appendChild(p);
                div.appendChild(a);

                tarjetas.appendChild(div);



            })
        })


}

function abrirModal(jugador) {
    const modal = document.getElementById('modal');
    const img = document.getElementById('modal-img');
    const nombre = document.getElementById('modal-nombre');
    const info = document.getElementById('modal-info');
    const palmares = document.getElementById('palmares');

    img.src = `http://localhost/parcial20252/la_tania/la_tania/api/img/fotos_jugadores/${jugador.imagen}`;
    nombre.textContent = jugador.nombre + " " + jugador.apellido;
    info.textContent = jugador.biografia || "Sin información adicional";

    console.log(jugador.dni)

    fetch(`http://localhost/parcial20252/la_tania/la_tania/api/palmares_listar.php?dni=${jugador.dni}`)
        .then(response => response.json())
        .then(data => {
            const cont = 0;
            data.productos.forEach(element => {

                const p = document.createElement('p');
                p.textContent = element.detalle;

                palmares.appendChild(p);



            })
        });

    crearTabla();
    modal.style.display = "flex";

    document.getElementById('cerrar-modal').addEventListener('click', () => {
        document.getElementById('modal').style.display = "none";
    });
}




crearMenu();

//para hacer que una página HTML sepa qué información debe mostrar 
// según lo que venga en la URL.

const params = new URLSearchParams(window.location.search);
const id_categoria = params.get('id_categoria');

if (id_categoria) {
    crearPagina(id_categoria);
}