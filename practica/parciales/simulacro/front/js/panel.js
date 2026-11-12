
// ======================================
// ELEMENTOS HTML
// ======================================

const vistaInicio = document.getElementById("inicio");
const vistaMasc = document.getElementById("canicasmasc");
const vistaFem = document.getElementById("canicasfem");

const btnInicio = document.getElementById("btn-inicio");
const btnMasc = document.getElementById("btn-canicasmasc");
const btnFem = document.getElementById("btn-canicasfem");

// ======================================
// CAMBIAR VISTA
// ======================================

function mostrarVista(vista) {

    vistaInicio.classList.add("d-none");
    vistaMasc.classList.add("d-none");
    vistaFem.classList.add("d-none");

    vista.classList.remove("d-none");
}

// ======================================
// EVENTOS
// ======================================

btnInicio.addEventListener("click", function () {
    mostrarVista(vistaInicio);
});

btnMasc.addEventListener("click", function () {
    mostrarVista(vistaMasc);
});

btnFem.addEventListener("click", function () {
    mostrarVista(vistaFem);
});
