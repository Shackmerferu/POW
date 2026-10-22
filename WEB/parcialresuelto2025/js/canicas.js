/* ============================================================
   canicas.js  —  Lógica de la página de Canicas (masc/fem)
   ------------------------------------------------------------
   Cada página canicas_*.html declara:
     <body data-categoria="1">   (1 = masculino, 3 = femenino)
   Este script lee ese valor y arma:
     1) La grilla de jugadores (con "Ver más" -> modal)
     2) La tabla de posiciones calculada con los partidos
   ============================================================ */

const categoria = Number(document.body.dataset.categoria);

/* ------------------- 1) JUGADORES ------------------- */

/** Trae los jugadores de la categoría, sin repetidos (por dni). */
async function cargarJugadores() {
  const filas = await pedirApi(`${API.jugadores}?id_categoria=${categoria}`);

  // La BD puede repetir jugadores que participan en varios deportes:
  // se deduplica usando el dni como clave de un Map.
  const unicos = new Map();
  filas.forEach((j) => unicos.set(j.dni, j));
  const jugadores = [...unicos.values()];

  const cont = document.getElementById("jugadores");
  cont.innerHTML = "";

  if (jugadores.length === 0) {
    cont.appendChild(crear("p", { clase: "aviso", texto: "No se encontraron jugadores." }));
    return;
  }

  jugadores.forEach((j) => {
    const card = crear("article", { clase: "jugador" });

    card.appendChild(
      crear("img", {
        clase: "jugador__foto",
        attrs: {
          src: `${API.imgJugadores}/${j.imagen}`,
          alt: `${j.nombre} ${j.apellido}`,
          loading: "lazy",
        },
      })
    );

    card.appendChild(
      crear("h3", { clase: "jugador__nombre", texto: `${j.nombre} ${j.apellido}`.trim() })
    );

    if (j.apodo && j.apodo.trim()) {
      card.appendChild(crear("p", { clase: "jugador__apodo", texto: `"${j.apodo.trim()}"` }));
    }

    const boton = crear("button", { clase: "boton boton--chico", texto: "Ver más" });
    boton.addEventListener("click", () => abrirModal(j));
    card.appendChild(boton);

    cont.appendChild(card);
  });
}

/* ------------------- 2) MODAL "VER MÁS" ------------------- */

let jugadorActual = null;

async function abrirModal(jugador) {
  jugadorActual = jugador;

  document.getElementById("modalFoto").src = `${API.imgJugadores}/${jugador.imagen}`;
  document.getElementById("modalNombre").textContent = `${jugador.nombre} ${jugador.apellido}`.trim();
  document.getElementById("modalApodo").textContent = jugador.apodo ? `"${jugador.apodo}"` : "";
  document.getElementById("modalBio").innerHTML = jugador.biografia || "Sin biografía.";
  document.getElementById("modalAnio").value = "";
  document.getElementById("modalDetalle").value = "";
  document.getElementById("modalMensaje").textContent = "";

  await cargarPalmares(jugador.dni);

  document.getElementById("modal").classList.add("modal--visible");
}

function cerrarModal() {
  document.getElementById("modal").classList.remove("modal--visible");
}

/** Trae y muestra la tabla de palmarés del jugador (por dni). */
async function cargarPalmares(dni) {
  const cont = document.getElementById("modalPalmares");
  cont.innerHTML = "";
  const filas = await pedirApi(`${API.palmaresListar}?dni=${dni}`);

  if (filas.length === 0) {
    cont.innerHTML = "<tr><td colspan='2'>Sin palmarés cargado.</td></tr>";
    return;
  }

  filas
    .sort((a, b) => Number(b.anio) - Number(a.anio))
    .forEach((p) => {
      const tr = crear("tr");
      tr.appendChild(crear("td", { texto: p.anio }));
      tr.appendChild(crear("td", { texto: p.detalle }));
      cont.appendChild(tr);
    });
}

/* --------------- 3) GUARDAR NUEVO PALMARÉS (PHP) --------------- */
/* Esta es la funcionalidad "A" a completar en el parcial:
   envía el año + detalle al endpoint palmares_guardar.php, y al
   volver OK recarga la tabla mostrando el ítem agregado. */

async function guardarPalmares() {
  if (!jugadorActual) return;

  const anio = document.getElementById("modalAnio").value.trim();
  const detalle = document.getElementById("modalDetalle").value.trim();
  const msg = document.getElementById("modalMensaje");

  if (!detalle) {
    msg.textContent = "Escribí un detalle antes de guardar.";
    msg.className = "mensaje mensaje--error";
    return;
  }

  const params = new URLSearchParams({
    dni: jugadorActual.dni,
    anio: anio || new Date().getFullYear(),
    detalle: detalle,
  });

  msg.textContent = "Guardando…";
  msg.className = "mensaje";

  try {
    const res = await fetch(`${API.palmaresGuardar}?${params.toString()}`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.status === 200) {
      msg.textContent = data.mensaje || "Palmarés guardado.";
      msg.className = "mensaje mensaje--ok";
      document.getElementById("modalAnio").value = "";
      document.getElementById("modalDetalle").value = "";
      await cargarPalmares(jugadorActual.dni); // refresca la lista
    } else {
      msg.textContent = data.mensaje || "No se pudo guardar.";
      msg.className = "mensaje mensaje--error";
    }
  } catch (e) {
    msg.textContent = "Error de conexión con la API.";
    msg.className = "mensaje mensaje--error";
    console.error(e);
  }
}

/* ------------------- 4) TABLA DE POSICIONES ------------------- */
/* Puntos:
     C1 -> 3 por ganar, 1 por empatar
     C2 -> 5 por ganar, 2 por empatar
   Por cada equipo se consultan sus partidos como local (A) y
   visitante (B), se calculan los puntos y se ordena la tabla. */

async function cargarTabla() {
  const cont = document.getElementById("tabla");
  const equipos = await pedirApi(API.equipos);

  const tabla = [];

  for (const eq of equipos) {
    let puntos = 0;

    const [locales, visitantes] = await Promise.all([
      pedirApi(`${API.partidos}?localia=A&id_equipo=${eq.id_equipo}&id_categoria=${categoria}`),
      pedirApi(`${API.partidos}?localia=B&id_equipo=${eq.id_equipo}&id_categoria=${categoria}`),
    ]);

    // Como local: el equipo es puntos_A
    locales.forEach((p) => {
      puntos += puntosPartido(Number(p.puntos_A), Number(p.puntos_B), p.modalidad);
    });
    // Como visitante: el equipo es puntos_B
    visitantes.forEach((p) => {
      puntos += puntosPartido(Number(p.puntos_B), Number(p.puntos_A), p.modalidad);
    });

    tabla.push({ nombre: eq.nombre.trim(), logo: eq.logo, puntos });
  }

  tabla.sort((a, b) => b.puntos - a.puntos);

  cont.innerHTML = "";
  tabla.forEach((eq, i) => {
    const fila = crear("div", { clase: "posicion" });
    fila.appendChild(crear("span", { clase: "posicion__puesto", texto: i + 1 }));
    fila.appendChild(
      crear("img", {
        clase: "posicion__logo",
        attrs: { src: `${API.imgLogos}/${eq.logo}`, alt: eq.nombre, loading: "lazy" },
      })
    );
    fila.appendChild(crear("span", { clase: "posicion__nombre", texto: eq.nombre }));
    fila.appendChild(crear("span", { clase: "posicion__puntos", texto: `${eq.puntos} pts` }));
    cont.appendChild(fila);
  });
}

/** Devuelve los puntos que suma "miEquipo" en un partido según modalidad. */
function puntosPartido(mios, rival, modalidad) {
  const c1 = String(modalidad).toUpperCase() === "C1";
  if (mios > rival) return c1 ? 3 : 5;
  if (mios === rival) return c1 ? 1 : 2;
  return 0;
}

/* ------------------- ARRANQUE ------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const btnCerrar = document.getElementById("cerrarModal");
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);

  const btnGuardar = document.getElementById("guardarPalmares");
  if (btnGuardar) btnGuardar.addEventListener("click", guardarPalmares);

  // Cerrar al hacer click en el fondo oscuro
  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });
  }

  cargarJugadores();
  cargarTabla();
});
