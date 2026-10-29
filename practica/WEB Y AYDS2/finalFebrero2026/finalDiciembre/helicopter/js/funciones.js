document.addEventListener("DOMContentLoaded", function () {
    const urlCiudades = "http://localhost/finalFebrero2026/finalDiciembre/helicopter/api/ciudades.php";
    const urlVuelos = "http://localhost/finalFebrero2026/finalDiciembre/helicopter/api/aeronaves.php";
    const opcionOrigen = document.getElementById("origen")
    const opcionDestino = document.getElementById("destino")

    const inputLatitudOrigen = document.getElementById("inputLatitudOrigen");
    const inputLongitudOrigen = document.getElementById("inputLongitudOrigen");
    const inputLatitudDestino = document.getElementById("inputLatitudDestino");
    const inputLongitudDestino = document.getElementById("inputLongitudDestino");

    const btnCalcular = document.getElementById("calcular");




    cargarLocalidades();

    function cargarLocalidades() {

        fetch(urlCiudades)
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then(data => {
                let listaCiudades = data.localidades;

                listaCiudades.sort((a, b) => a.nombre_ciudad.localeCompare(b.nombre_ciudad));

                listaCiudades.forEach(localidad => {
                    const item = `<option value="${localidad.id}">${localidad.nombre_ciudad}</option>`;

                    opcionOrigen.innerHTML += item;
                    opcionDestino.innerHTML += item;
                });
            })
            .catch(error => {
                console.error("Error al cargar las localidades:", error);
            });
    }

    opcionOrigen.addEventListener("change", function () {
        const idLocalidadSeleccionada = this.value;

        fetch(urlCiudades)
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then(data => {
                data.localidades.forEach(localidad => {
                    if (localidad.id == idLocalidadSeleccionada) {
                        inputLatitudOrigen.value = localidad.latitud;
                        inputLongitudOrigen.value = localidad.longitud;
                    }
                })
            })
    })


    opcionDestino.addEventListener("change", function () {
        const idLocalidadSeleccionada = this.value;

        fetch(urlCiudades)
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then(data => {
                data.localidades.forEach(localidad => {
                    if (localidad.id == idLocalidadSeleccionada) {
                        inputLatitudDestino.value = localidad.latitud;
                        inputLongitudDestino.value = localidad.longitud;
                    }
                })
            })
    })


    btnCalcular.addEventListener("click", function () {

        let distancia = calcularDistancia(inputLatitudOrigen, inputLongitudOrigen, inputLatitudDestino, inputLongitudDestino);

        generarVuelos(distancia);
    })


    function calcularDistancia(lat1, lon1, lat2, lon2) {
        let lat1Num = parseFloat(lat1.value);
        let lon1Num = parseFloat(lon1.value);
        let lat2Num = parseFloat(lat2.value);
        let lon2Num = parseFloat(lon2.value);
        const PI = 3.14159265358979323846;


        let radLat1 = lat1Num * PI / 180;
        let radLong1 = lon1Num * PI / 180;
        let radLat2 = lat2Num * PI / 180;
        let radLong2 = lon2Num * PI / 180;
        let d = 6371 * Math.acos(Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radLong2 - radLong1) + Math.sin(radLat1) * Math.sin(radLat2));
        return d
    }

    function generarVuelos(distancia) {
        const imagenURL = "../helicopter/api/imagenes_api/"
        const tabladeVuelos = document.getElementById('tablaVuelos');
        tabladeVuelos.innerHTML = "";
        if (distancia > 800) {
            alert('Fuera de rango de operación');
            return;
        }
        fetch(urlVuelos)
            .then(response => {
                if (response.status == 200)
                    return response.json();
            })
            .then(data => {
                data.aeronaves.forEach(aeronave => {
                    let tiempoVuelo = distancia / aeronave.velocidad_media_km_h;
                    let precioVuelo = (tiempoVuelo + 0.1) * aeronave.valor_hora_vuelo;
                    let tiempo = convertirTiempo(tiempoVuelo);

                    const fila = `<tr>
                                       <td> <img src="${imagenURL}${aeronave.imagen}"></img></td>
                                       <td> ${aeronave.nombre} </td>
                                       <td> Pasajeros: ${aeronave.cantidad_pasajeros}</td>
                                       <td> Velocidad crucero: ${aeronave.velocidad_media_km_h}</td>
                                       <td> Costo de la hora de vuelo: ${aeronave.valor_hora_vuelo}</td>
                                       <td> Costo del vuelo: ${precioVuelo.toFixed(2)}</td>
                                       <td> Horas de vuelo: ${tiempo}</td>
                                    </tr>`;
                    tabladeVuelos.innerHTML += fila
                })

            })
    }

    function convertirTiempo(horasDecimales) {
        const horas = Math.floor(horasDecimales);
        const minutosDecimales = (horasDecimales - horas) * 60;
        const minutos = Math.floor(minutosDecimales);
        const segundos = Math.round((minutosDecimales - minutos) * 60);

        // Retornamos el texto formateado (ej: "1h 25m 30s")
        return `${horas}h ${minutos}m ${segundos}s`;
    }
});
