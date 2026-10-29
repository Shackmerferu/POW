document.addEventListener("DOMContentLoaded", function () {
    const idRecolector = localStorage.getItem("id_recolector");
    const nombreRecolector = document.getElementById("nombre");
    const apellidoRecolector = document.getElementById("apellido");
    const cellRecolector = document.getElementById("celular");
    const latRecolector = document.getElementById("lat");
    const lonRecolector = document.getElementById("long");
    const disponible = document.getElementById("disponible");
    const btnEnviar = document.getElementById("btnEnviar");

    if (idRecolector) {
        window.location.href = "home.html";
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lonRecolector.value = position.coords.longitude.toFixed(4);
            latRecolector.value = position.coords.latitude.toFixed(4);

        }, function (error) {
            alert("Error al obtener la ubicacion");
            latRecolector.value = "";
            lonRecolector.value = "";
            document.getElementById('btnEnviar').disabled = true;

        })
    } else {
        alert("El navegador no soporta la geolocalizacion");
    }


    btnEnviar.addEventListener("click", function (e) {
        e.preventDefault();
        const url = "http://localhost/finalFebrero2026/parcial2024/backend/guardar_recolector.php"
        const datos = new FormData();
        datos.append("nombre", nombreRecolector.value);
        datos.append("apellido", apellidoRecolector.value);
        datos.append("celular", cellRecolector.value);
        datos.append("latitud", latRecolector.value);
        datos.append("longitud", lonRecolector.value);
        datos.append("disponible", disponible.value);
        fetch(url, {
            method: "POST",
            body: datos
        })
            .then(response => response.json())
            .then(data => {
                // AGREGA ESTAS LINEAS PARA VER QUÉ PASA
                console.log("Respuesta del servidor:", data);
                console.log("Status:", data.status);
                console.log("ID Recolector:", data.id_recolector);

                if (data.status == 200 && data.id_recolector) {
                    window.localStorage.setItem("id_recolector", data.id_recolector);
                    window.location.href = "home.html";
                } else {
                    console.log("No entró al IF. Algo falló en la condición.");
                }
            })
            .catch(error => {
                console.error("Error al ejecutar el AJAX:", error);
            });
    })
})