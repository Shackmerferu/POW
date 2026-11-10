// ======================================
// VERIFICAR SESIÓN EXISTENTE
// ======================================

const token = sessionStorage.getItem("termos_token");

if (token) {
    window.location.replace("panel.html");
}


// ======================================
// OBTENER ELEMENTOS HTML
// ======================================

const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");


// ======================================
// INICIAR SESIÓN
// ======================================

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    // Obtener valores
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("contrasenia").value;

    // Validar campos
    if (usuario === "" || password === "") {
        mensaje.textContent = "Complete todos los campos.";
        return;
    }

    // Preparar parámetros
    const parametros = new URLSearchParams();

    parametros.append("usuario", usuario);
    parametros.append("password", password);

    // Consultar API
    fetch("http://localhost/facultad/POW/practica/parciales/prueba1/termos/api/login.php?" + parametros.toString())

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Error HTTP: " + response.status);
            }

            return response.json();
        })

        .then(function (data) {

            console.log("Respuesta de PHP:", data);

            if (data.status === 200 && data.token) {

                // Guardar token
                sessionStorage.setItem("termos_token", data.token);

                // Guardar información del usuario
                sessionStorage.setItem("termos_nombre", data.nombre);
                sessionStorage.setItem("termos_apellido", data.apellido);

                // Ir al panel
                window.location.replace("panel.html");

            } else {

                mensaje.textContent = "Usuario o contraseña incorrectos.";

            }
        })

        .catch(function (error) {

            console.error("Error:", error);

            mensaje.textContent = "Error al comunicarse con el servidor.";

        });
});