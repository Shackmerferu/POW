import "./confirmarAccion.css";

let modalAbierto = false;

/** Muestra un diálogo propio y resuelve true si se confirma, false si se cancela. */
export function confirmarAccion(mensaje) {
  if (modalAbierto) return Promise.resolve(false);
  modalAbierto = true;

  return new Promise((resolver) => {
    const focoAnterior = document.activeElement;
    const id = `confirmacion-accion-${Date.now()}`;
    const fondo = document.createElement("div");
    fondo.className = "confirmacion-accion__fondo";
    fondo.setAttribute("role", "presentation");

    const dialogo = document.createElement("section");
    dialogo.className = "confirmacion-accion";
    dialogo.setAttribute("role", "dialog");
    dialogo.setAttribute("aria-modal", "true");
    dialogo.setAttribute("aria-labelledby", `${id}-titulo`);
    dialogo.setAttribute("aria-describedby", `${id}-mensaje`);

    const encabezado = document.createElement("header");
    encabezado.className = "confirmacion-accion__encabezado";
    const titulo = document.createElement("h2");
    titulo.id = `${id}-titulo`;
    titulo.textContent = "Confirmar acción";
    encabezado.appendChild(titulo);

    const cuerpo = document.createElement("div");
    cuerpo.className = "confirmacion-accion__cuerpo";
    const texto = document.createElement("p");
    texto.id = `${id}-mensaje`;
    texto.textContent = mensaje;
    cuerpo.appendChild(texto);

    const acciones = document.createElement("footer");
    acciones.className = "confirmacion-accion__acciones";
    const cancelar = document.createElement("button");
    cancelar.type = "button";
    cancelar.className = "confirmacion-accion__boton confirmacion-accion__boton--cancelar";
    cancelar.textContent = "Cancelar";
    const continuar = document.createElement("button");
    continuar.type = "button";
    continuar.className = "confirmacion-accion__boton confirmacion-accion__boton--continuar";
    continuar.textContent = "Sí, continuar";
    acciones.append(cancelar, continuar);

    dialogo.append(encabezado, cuerpo, acciones);
    fondo.appendChild(dialogo);

    let finalizado = false;
    const cerrar = (confirmada) => {
      if (finalizado) return;
      finalizado = true;
      modalAbierto = false;
      document.removeEventListener("keydown", alPresionarTecla);
      fondo.remove();
      if (focoAnterior && typeof focoAnterior.focus === "function") {
        focoAnterior.focus();
      }
      resolver(confirmada);
    };
    const alPresionarTecla = (evento) => {
      if (evento.key === "Escape") cerrar(false);
      if (evento.key === "Tab") {
        evento.preventDefault();
        (document.activeElement === continuar ? cancelar : continuar).focus();
      }
    };

    cancelar.addEventListener("click", () => cerrar(false));
    continuar.addEventListener("click", () => cerrar(true));
    fondo.addEventListener("click", (evento) => {
      if (evento.target === fondo) cerrar(false);
    });
    dialogo.addEventListener("click", (evento) => evento.stopPropagation());
    document.addEventListener("keydown", alPresionarTecla);
    document.body.appendChild(fondo);
    continuar.focus();
  });
}
