document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-vista]").forEach(btn => {
    btn.addEventListener("click", () => mostrarVista(btn.dataset.vista));
  });
});
function mostrarVista(id) {
  document.querySelectorAll(".vista").forEach(v => v.classList.add("d-none"));
  document.getElementById(id)?.classList.remove("d-none");
  document.querySelectorAll("[data-vista]").forEach(b => b.classList.toggle("active", b.dataset.vista === id));
}
function mostrarMensaje(id, texto, error=false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = error ? "mt-3 text-danger" : "mt-3 text-success";
}
