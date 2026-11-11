// ======================================
// RUTAS DE LAS API
// ======================================

window.API =
  "http://localhost/facultad/POW/practica/parciales/prueba1/termos/api/";

// ======================================
// VERIFICAR SESIÓN
// ======================================

window.verificarSesion = function () {
  const token = sessionStorage.getItem("termos_token");

  if (!token) {
    window.location.replace("index.html");
    return false;
  }

  return true;
};

if (!window.verificarSesion()) {
  // La página será reemplazada por index.html.
}

// ======================================
// CERRAR SESIÓN
// ======================================

const btnSalir = document.getElementById("btn-salir");

btnSalir.addEventListener("click", cerrarSesion);

function cerrarSesion() {
  const seguro = window.confirm("¿Está seguro de que desea cerrar sesión?");

  if (!seguro) {
    return;
  }

  sessionStorage.removeItem("termos_token");
  sessionStorage.removeItem("termos_nombre");
  sessionStorage.removeItem("termos_apellido");

  window.location.replace("index.html");
}

// ======================================
// OBTENER ELEMENTOS HTML
// ======================================

const inicio = document.getElementById("inicio");
const termos = document.getElementById("termos");
const personas = document.getElementById("personas");

const btnInicio = document.getElementById("btn-inicio");
const btnTermos = document.getElementById("btn-termos");
const btnPersonas = document.getElementById("btn-personas");

// ======================================
// CAMBIAR DE VISTA
// ======================================

window.cambiarVista = function (vista, actualizarTermos = true) {
  inicio.classList.add("d-none");
  termos.classList.add("d-none");
  personas.classList.add("d-none");

  btnInicio.classList.replace("btn-light", "btn-primary");
  btnTermos.classList.replace("btn-light", "btn-primary");
  btnPersonas.classList.replace("btn-light", "btn-primary");

  if (vista === "inicio") {
    inicio.classList.remove("d-none");
    btnInicio.classList.replace("btn-primary", "btn-light");
  } else if (vista === "termos") {
    termos.classList.remove("d-none");
    btnTermos.classList.replace("btn-primary", "btn-light");

    if (actualizarTermos) {
      cargarTermos();
    }
  } else if (vista === "personas") {
    personas.classList.remove("d-none");
    btnPersonas.classList.replace("btn-primary", "btn-light");
  }
};

// ======================================
// EVENTOS DE NAVEGACIÓN
// ======================================

btnInicio.addEventListener("click", function () {
  window.cambiarVista("inicio");
});

btnTermos.addEventListener("click", function () {
  if (!window.verificarSesion()) {
    return;
  }

  window.cambiarVista("termos");
});

btnPersonas.addEventListener("click", function () {
  if (!window.verificarSesion()) {
    return;
  }

  window.cambiarVista("personas");
});
