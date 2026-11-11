// ======================================
// RUTAS DE LAS API
// ======================================




// ======================================
// OBTENER ELEMENTOS HTML
// ======================================

const inicio = document.getElementById("inicio");
const masculino = document.getElementById("masculino");
const femenino = document.getElementById("femenino");


const btnInicio = document.getElementById("btn-inicio");
const btnmasculino = document.getElementById("btn-masculino");
const btnfemenino = document.getElementById("btn-femenino");


// ======================================
// CAMBIAR DE VISTA
// ======================================

window.cambiarVista = function (vista, actualizarTermos = true) {
  inicio.classList.add("d-none");
  masculino.classList.add("d-none");
  femenino.classList.add("d-none");

  btnInicio.classList.replace("btn-light", "btn-primary");
  btnmasculino.classList.replace("btn-light", "btn-primary");
  btnfemenino.classList.replace("btn-light", "btn-primary");

  if (vista === "inicio") {
    inicio.classList.remove("d-none");
    btnInicio.classList.replace("btn-primary", "btn-light");
  } else if (vista === "masculino") {
    masculino.classList.remove("d-none");
    btnmasculino.classList.replace("btn-primary", "btn-light");

  } else if (vista === "femenino") {
    femenino.classList.remove("d-none");
    btnfemenino.classList.replace("btn-primary", "btn-light");
  }
};

// ======================================
// EVENTOS DE NAVEGACIÓN
// ======================================

btnInicio.addEventListener("click", function () {
  window.cambiarVista("inicio");
});

btnmasculino.addEventListener("click", function () {
  window.cambiarVista("masculino");
  cargarJugadores(1, "contenedor-jugadores-masc");
});

btnfemenino.addEventListener("click", function () {
  window.cambiarVista("femenino");
  cargarJugadores(3, "contenedor-jugadores-fem");
});


