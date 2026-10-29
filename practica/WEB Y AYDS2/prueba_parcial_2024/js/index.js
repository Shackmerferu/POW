document.addEventListener('DOMContentLoaded', function () {

    const idRecolector = localStorage.getItem("id_recolector");

    if (idRecolector) {//si ya existe va al home
        console.log("Usuario ya registrado, redirigiendo...");
        window.location.href = "home.html";
        return;
    }

    const latitudInput = document.getElementById("latitud");
    const longitudInput = document.getElementById("longitud");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            longitudInput.value = position.coords.longitude.toFixed(4);
            latitudInput.value = position.coords.latitude.toFixed(4);

        }, function (error) {
            alert("Error al obtener la ubicacion");
            latitudInput.value = "";
            longitudInput.value = "";
            document.getElementById('btnEnviar').disabled = true;

        })
    } else {
        alert("El navegador no soporta la geolocalizacion");
    }

    const formulario = document.getElementById("formRegistro");

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(formRegistro);
        formData.append('disponible', 'S');

        const API_URL = "backend/guardar_recolector.php"
        fetch(API_URL, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 200 && data.id_recolector) {
                    localStorage.setItem("id_recolector", data.id_recolector);
                    alert("Registro exitoso");
                    window.location.href = "home.html";
                } else {
                    alert("Error en el registro: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error en la llamada AJAX:', error);
                alert('Error de conexión. No se pudo contactar al servidor.');
            })
    })
});