/* ============================================================
   registrar.js  —  Punto EXTRA "Agregar club"
   ------------------------------------------------------------
   Toma el formulario (nombre + logo) y lo envía por AJAX con
   FormData al endpoint equipos_insertar.php, que debe guardar el
   equipo en la BD y subir la imagen a img/logos/.
   La respuesta (JSON) se muestra en pantalla.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formClub");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evitar la recarga: esto lo hace "reactivo"

    const msg = document.getElementById("msg");
    const fd = new FormData(form); // incluye el archivo automáticamente

    msg.textContent = "Enviando…";
    msg.className = "mensaje";

    try {
      // FormData se envía por POST SIN fijar Content-Type:
      // el navegador pone el boundary de multipart/form-data.
      const res = await fetch(API.equiposInsertar, { method: "POST", body: fd });
      const data = await res.json();

      if (data.status === 200) {
        msg.textContent = "✔ " + (data.mensaje || "Club guardado.");
        msg.className = "mensaje mensaje--ok";
        form.reset();
      } else {
        msg.textContent = "✘ " + (data.mensaje || "No se pudo guardar.");
        msg.className = "mensaje mensaje--error";
      }
    } catch (err) {
      msg.textContent = "✘ Error de conexión con la API.";
      msg.className = "mensaje mensaje--error";
      console.error(err);
    }
  });
});
