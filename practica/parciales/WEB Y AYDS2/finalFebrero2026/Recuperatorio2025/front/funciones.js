document.addEventListener("DOMContentLoaded", function () {
    const URLmenu = "http://localhost/finalFebrero2026/Recuperatorio2025/api/menu.php"
    const URLequipos = "http://localhost/finalFebrero2026/Recuperatorio2025/api/equipos.php"
    const URLpartidos = "http://localhost/finalFebrero2026/Recuperatorio2025/api/partidos.php"

    const selectP = document.getElementById("disciplina");
    const selectM = document.getElementById("modalidad");

    const btnGuardar = document.getElementById("btnGuardar");

    let equipos = [];
    cargarSelect();

    function cargarSelect() {
        fetch(URLmenu)
            .then(response => response.json())
            .then(data => {

                data.productos.forEach(element => {
                    if (parseInt(element.id_categoria) > 0) {

                        const option = document.createElement("option");
                        option.value = element.id_categoria;
                        option.textContent = element.titulo;
                        selectP.appendChild(option)



                    }
                });


            })
    }

    selectM.addEventListener("change", function () {
        const modalidadOPTION = selectM.value;
        const categoriaOPTION = selectP.value;
        if (modalidadOPTION !== "" && categoriaOPTION !== "") {
            cargarDatosEnOrden(categoriaOPTION, modalidadOPTION);
        }

    })


    function cargarDatosEnOrden(disciplina, modalidad) {
        const Selectequpo1 = document.getElementById("1equipo");
        const Selectequpo2 = document.getElementById("2equipo");

        // 1. Limpiamos selects
        Selectequpo1.innerHTML = '<option value="">Selecciona equipo</option>';
        Selectequpo2.innerHTML = '<option value="">Selecciona equipo</option>';


        fetch(URLequipos + `?id_categoria=${disciplina}&modalidad=${modalidad}`)
            .then(response => response.json())
            .then(data => {
                // Guardamos en la global para usarla después en la tabla
                equipos = data.productos;


                data.productos.forEach(element => {
                    const option1 = document.createElement("option");
                    option1.value = element.id_equipo;
                    option1.textContent = element.nombre;
                    Selectequpo1.appendChild(option1);

                    const option2 = option1.cloneNode(true);
                    Selectequpo2.appendChild(option2);
                });

                // 3. SEGUNDO: Ahora que YA tenemos equipos, cargamos la TABLA de partidos
                // Esto se hace AQUÍ ADENTRO para asegurar que 'listaEquipos' no esté vacía
                actualizarTabla(disciplina, modalidad);
            })
            .catch(error => console.error("Error cargando equipos:", error));
    }

    function actualizarTabla(disciplina, modalidad) {
        const tabalaResultados = document.getElementById("tablaResultados");
        //tabalaResultados.innerHTML = "";

        console.log("1. Solicitando partidos para:", disciplina, modalidad);

        fetch(URLpartidos + `?id_categoria=${disciplina}&modalidad=${modalidad}`)
            .then(response => response.json())
            .then(data => {
                console.log("2. Respuesta completa del servidor:", data);

            // VERIFICACION CLAVE: ¿La API devuelve 'partidos' o 'productos'?
            const listaPartidos = data.partidos || data.productos; 
            
            console.log("3. Lista detectada:", listaPartidos);
                if (listaPartidos && listaPartidos.length > 0) {
                    tabalaResultados.innerHTML = "";
                    listaPartidos.forEach(partido => {
                        const eqA = equipos.find(equipo => equipo.id_equipo == partido.id_equipo_A)
                        const eqB = equipos.find(equipo => equipo.id_equipo == partido.id_equipo_B)

                        

                        const fila = document.createElement("tr");

                        // Aquí usamos las variables que acabamos de definir arriba
                        fila.innerHTML = `
                            <td>${eqA.nombre}</td>
                            <td><img src="../api/img/logos/${eqA.logo}" alt="logo" width="30"></td>
                            <td>${partido.puntos_A}</td>
                            <td>VS</td>
                            <td>${eqB.nombre}</td>
                            <td><img src="../api/img/logos/${eqB.logo}" alt="logo" width="30"></td>
                            <td>${partido.puntos_B}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarPartido(${partido.id_partido})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="borrarPartido(${partido.id_partido})">Borrar</button>
                            </td>
                        `;
                        tablaResultados.appendChild(fila);
                    })
                }
            })
    }


    btnGuardar.addEventListener("click", function () {
        const equipo1 = parseInt(document.getElementById("1equipo").value);
        const goles1 = parseInt(document.getElementById("1goles").value);
        const equipo2 = parseInt(document.getElementById("2equipo").value);
        const goles2 = parseInt(document.getElementById("2goles").value);
        const categoria = selectP.value;
        const modalidad = selectM.value;
        const mensajeDiv = document.getElementById("mensaje");
        mensajeDiv.innerHTML = "";

        if (equipo1 === "" || equipo2 === "" || goles1 === "" || goles2 === "") {
            alert("Completa todos los campos");
            return;
        }

        if (equipo1 === equipo2) {
            alert("No se puede cargar un partido con el mismo equipo.");
            return;
        }

        fetch(URLpartidos + `?action=insertar&id_categoria=${categoria}&modalidad=${modalidad}&id_equipo_A=${equipo1}&id_equipo_B=${equipo2}&puntos_A=${goles1}&puntos_B=${goles2}`)
            .then(response => {
                if (response.status == 200) {
                    mensajeDiv.innerHTML = `<h4>Partido cargado correctamente</h4>`;
                    goles1.value = "";
                    goles2.value = "";
                    actualizarTabla(categoria, modalidad);
                } else {
                    mensajeDiv.innerHTML = `<h4>Error al cargar el partido</h4>`;
                }
            })


    })

    function borrarPartido(id_partido) {
        fetch(URLpartidos + `?action=borrar&id_partido=${id_partido}`)
            .then(response => {
                if (response.status == 200) {
                    const categoria = selectP.value;
                    const modalidad = selectM.value;
                    actualizarTabla(categoria, modalidad);
                } else {
                    alert("Error al borrar el partido");
                }
            })
    }
    function editarPartido(id_partido) {}



})