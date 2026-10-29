document.addEventListener("DOMContentLoaded", function () {
    const URL_API = "http://localhost/finalFebrero2026/parcial2025/la_tania/la_tania/api/"
    const nav = document.getElementById("nav");
    const areaDisplayM = document.getElementById("tarjetas");
    const areaDisplayF = document.getElementById("areaDisplayF");
    const urlParams = new URLSearchParams(window.location.search);
    const idCategoria = urlParams.get('id');
    const tablaPosiciones = document.getElementById("tablaPosicionesM");
    const tablaPosicionesF = document.getElementById("tablaPosicionesF");
    const btnVermas = document.getElementById("btnVermas");

    cargarMenu();

    function cargarMenu() {
        fetch(URL_API + 'menu.php')
            .then(response => response.json())
            .then(data => {
                data.productos.forEach(elemento => {
                    if (elemento.visible.toUpperCase() == 'SI') {
                        const a = document.createElement("a");
                        a.textContent = elemento.titulo;
                        a.href = `${elemento.src}?id=${elemento.id_categoria}`;
                        nav.appendChild(a);


                    }


                })

            })
    }

    if (idCategoria == 1) {
        cargarCanicasM();
        cargarTablaPosicionesM();
    }
    if (idCategoria == 3) {
        cargarCanicasF();
        cargarTablaPosicionesF();
    }

    function cargarCanicasM() {

        fetch(URL_API + 'jugadores.php')
            .then(response => response.json())
            .then(data => {

                data.productos.forEach(element => {
                    if (element.id_categoria == 1) {
                        const div = document.createElement('div');
                        const a = document.createElement('a');
                        const p = document.createElement('p');
                        const img = document.createElement('img');

                        a.textContent = "Ver mas";
                        a.href = "#";

                        img.src = URL_API + `/img/fotos_jugadores/${element.imagen}`;

                        p.textContent = element.nombre + element.apellido;

                        a.addEventListener('click', () => {
                            abrirModal(element);
                        })

                        div.appendChild(img);
                        div.appendChild(p);
                        div.appendChild(a);

                        areaDisplayM.appendChild(div);
                    }



                })
            })
    }


    function cargarCanicasF() {

        fetch(URL_API + 'jugadores.php')
            .then(response => response.json())
            .then(data => {
                
                data.productos.forEach(jugador => {
                    if (jugador.id_categoria == 3) {
                        const div = document.createElement('div');
                        const a = document.createElement('a');
                        const p = document.createElement('p');
                        const img = document.createElement('img');

                        a.textContent = "Ver mas";
                        a.href = "#";

                        img.src = URL_API + `/img/fotos_jugadores/${jugador.imagen}`;

                        p.textContent = jugador.nombre + " " + jugador.apellido;


                        a.addEventListener('click', () => {
                            abrirModal(jugador);
                        })
                         
                        div.appendChild(img);
                        div.appendChild(p);
                        div.appendChild(a);

                        areaDisplayF.appendChild(div);
                    }

                })

                areaDisplayF.innerHTML = div;
            })
    }

    async function cargarTablaPosicionesM() {

        tablaPosiciones.innerHTML += `<table class="table table-striped">
            <thead>
                <tr>
                    <th></th>
                    <th>Equipo</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody id="cuerpoTabla">
            </tbody>
        </table>`
        const cuerpoTabla = document.getElementById("cuerpoTabla");
        const equipos = await fetch(URL_API + 'equipos.php');
        const data = await equipos.json();
        let listaEquiposOrdenada = [];



        for (const element of data.productos) {
            let sumaA = 0;

            const [resA, resB] = await Promise.all([
                fetch(URL_API + `partidos.php?localia=A&id_equipo=${element.id_equipo}&id_categoria=1`),
                fetch(URL_API + `partidos.php?localia=B&id_equipo=${element.id_equipo}&id_categoria=1`)
            ])

            const dataA = await resA.json();
            const dataB = await resB.json();
            if (dataA.productos && Array.isArray(dataA.productos)) {
                dataA.productos.forEach(partido => {
                    if (parseInt(partido.puntos_A) > parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 3 : 5;
                    } else if (parseInt(partido.puntos_A) === parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 1 : 2;
                    }
                });
            }

            // Hacemos lo mismo para dataB
            if (dataB.productos && Array.isArray(dataB.productos)) {
                dataB.productos.forEach(partido => {
                    if (parseInt(partido.puntos_A) < parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 3 : 5;
                    } else if (parseInt(partido.puntos_A) === parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 1 : 2;
                    }
                });
            }

            listaEquiposOrdenada.push({
                equipo: element,
                puntos: sumaA

            })

        }

        listaEquiposOrdenada.sort((a, b) => b.puntos - a.puntos);

        listaEquiposOrdenada.forEach(item => {
            const fila = document.createElement('tr');
            const img = document.createElement('img');
            img.src = `${URL_API}/img/logos/${item.equipo.logo}`
            img.width = 50;

            const tdImg = document.createElement('td');
            tdImg.appendChild(img);

            const tdNombre = document.createElement('td');
            tdNombre.textContent = item.equipo.nombre;

            const tdPuntos = document.createElement('td');
            tdPuntos.textContent = item.puntos;

            fila.appendChild(tdImg);
            fila.appendChild(tdNombre);
            fila.appendChild(tdPuntos);
            cuerpoTabla.appendChild(fila);
        })


    }

    async function cargarTablaPosicionesF() {

        tablaPosicionesF.innerHTML += `<table class="table table-striped">
            <thead>
                <tr>
                    <th></th>
                    <th>Equipo</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody id="cuerpoTabla">
            </tbody>
        </table>`
        const cuerpoTabla = document.getElementById("cuerpoTabla");
        const equipos = await fetch(URL_API + 'equipos.php');
        const data = await equipos.json();
        let listaEquiposOrdenada = [];



        for (const element of data.productos) {
            let sumaA = 0;

            const [resA, resB] = await Promise.all([
                fetch(URL_API + `partidos.php?localia=A&id_equipo=${element.id_equipo}&id_categoria=3`),
                fetch(URL_API + `partidos.php?localia=B&id_equipo=${element.id_equipo}&id_categoria=3`)
            ])

            const dataA = await resA.json();
            const dataB = await resB.json();
            if (dataA.productos && Array.isArray(dataA.productos)) {
                dataA.productos.forEach(partido => {
                    if (parseInt(partido.puntos_A) > parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 3 : 5;
                    } else if (parseInt(partido.puntos_A) === parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 1 : 2;
                    }
                });
            }

            // Hacemos lo mismo para dataB
            if (dataB.productos && Array.isArray(dataB.productos)) {
                dataB.productos.forEach(partido => {
                    if (parseInt(partido.puntos_A) < parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 3 : 5;
                    } else if (parseInt(partido.puntos_A) === parseInt(partido.puntos_B)) {
                        sumaA += partido.modalidad === 'C1' ? 1 : 2;
                    }
                });
            }

            listaEquiposOrdenada.push({
                equipo: element,
                puntos: sumaA

            })

        }

        listaEquiposOrdenada.sort((a, b) => b.puntos - a.puntos);

        listaEquiposOrdenada.forEach(item => {
            const fila = document.createElement('tr');
            const img = document.createElement('img');
            img.src = `${URL_API}/img/logos/${item.equipo.logo}`
            img.width = 50;

            const tdImg = document.createElement('td');
            tdImg.appendChild(img);

            const tdNombre = document.createElement('td');
            tdNombre.textContent = item.equipo.nombre;

            const tdPuntos = document.createElement('td');
            tdPuntos.textContent = item.puntos;

            fila.appendChild(tdImg);
            fila.appendChild(tdNombre);
            fila.appendChild(tdPuntos);
            cuerpoTabla.appendChild(fila);
        })


    }

    function abrirModal(jugador) {
        const modal = document.getElementById('modal');
        const img = document.getElementById('modal-img');
        const nombre = document.getElementById('modal-nombre');
        const apodo = document.getElementById('modal-apodo');
        const info = document.getElementById('modal-info');
        const tablaPalmares = document.getElementById('tabla-palmares');

        // limpiar tabla
        tablaPalmares.innerHTML = '';

        img.src = URL_API + `img/fotos_jugadores/${jugador.imagen}`;
        nombre.textContent = `${jugador.apellido} ${jugador.nombre}`;
        apodo.textContent = `Apodo: ${jugador.apodo || 'Sin apodo'}`;
        info.textContent = jugador.biografia || "Sin biografía disponible";

        // consultar palmares
        fetch(`${URL_API}palmares_listar.php?dni=${jugador.dni}`)
            .then(res => res.json())
            .then(data => {
                data.productos.forEach(p => {
                    const tr = document.createElement('tr');

                    tr.innerHTML = `
                    <td>${p.anio || '-'}</td>
                    <td>${p.detalle}</td>
                `;

                    tablaPalmares.appendChild(tr);
                });
            });

        modal.style.display = "flex";

        document.getElementById('cerrar-modal').onclick = () => {
            modal.style.display = "none";
        };
    }
});