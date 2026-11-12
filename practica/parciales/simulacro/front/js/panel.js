// ======================================
// ELEMENTOS HTML
// ======================================

const vistas = [
    document.getElementById("inicio"),
    document.getElementById("canicasmasc"),
    document.getElementById("canicasfem")
];

const botones = [
    document.getElementById("btn-inicio"),
    document.getElementById("btn-canicasmasc"),
    document.getElementById("btn-canicasfem")
];

// ======================================
// CAMBIAR VISTA
// ======================================

function mostrarVista(indice) {

    vistas.forEach(function(vista) {

        vista.classList.add("d-none");

    });

    vistas[indice].classList.remove("d-none");

}

// ======================================
// EVENTOS
// ======================================

botones.forEach(function(boton, indice) {

    boton.addEventListener("click", function() {

        mostrarVista(indice);

    });

});