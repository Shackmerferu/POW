
// ======================================
// RUTAS DE LAS API
// ======================================

window.API = "http://localhost/facultad/POW/practica/parciales/simulacro/api/";

// ======================================
// OBTENER ELEMENTOS HTML
// ======================================

const inicio = document.getElementById("inicio");
const canicasmasc = document.getElementById("canicasmasc");
const canicasfem = document.getElementById("canicasfem");

const btnInicio = document.getElementById("btn-inicio");
const btnCanicasmasc = document.getElementById("btn-canicasmasc");
const btnCanicasfem = document.getElementById("btn-canicasfem");
const btnRegistrar = document.getElementById("btn-registrarclub");

// ======================================
// CAMBIAR DE VISTA
// ======================================

window.cambiarVista = function (vista) {

    inicio.classList.add("d-none");
    canicasmasc.classList.add("d-none");
    canicasfem.classList.add("d-none");

    btnInicio.classList.remove("btn-outline-light");
    btnCanicasmasc.classList.remove("btn-outline-light");
    btnCanicasfem.classList.remove("btn-outline-light");

    if (vista === "inicio") {

        inicio.classList.remove("d-none");
        btnInicio.classList.add("btn-outline-light");

    } else if (vista === "canicasmasc") {

        canicasmasc.classList.remove("d-none");
        btnCanicasmasc.classList.add("btn-outline-light");

    } else if (vista === "canicasfem") {

        canicasfem.classList.remove("d-none");
        btnCanicasfem.classList.add("btn-outline-light");

    }
};

// ======================================
// EVENTOS DE NAVEGACIÓN
// ======================================

btnInicio.addEventListener("click", function () {
    window.cambiarVista("inicio");
});

btnCanicasmasc.addEventListener("click", function () {
    window.cambiarVista("canicasmasc");
});

btnCanicasfem.addEventListener("click", function () {
    window.cambiarVista("canicasfem");
});

// ======================================
// VISTA INICIAL
// ======================================

window.cambiarVista("inicio");
