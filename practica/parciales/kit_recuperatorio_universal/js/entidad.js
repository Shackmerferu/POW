let registros = [];
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("tabla-body")) return;
  document.getElementById("btn-recargar").addEventListener("click", cargarRegistros);
  document.getElementById("filtro").addEventListener("input", renderTabla);
  document.getElementById("form-entidad").addEventListener("submit", guardarRegistro);
  document.getElementById("btn-cancelar").addEventListener("click", limpiarFormulario);
  cargarRegistros();
});

async function cargarRegistros() {
  try {
    const data = await api.get(APP.ENDPOINTS.list, {}, true);
    registros = data[APP.RESPONSE.listKey];
    if (!Array.isArray(registros)) throw new Error("Revisá RESPONSE.listKey: la respuesta no contiene un array.");
    renderTabla();
  } catch(e) {
    console.error(e);
    document.getElementById("tabla-body").innerHTML =
      `<tr><td colspan="20" class="text-danger">${escapar(e.message)}</td></tr>`;
  }
}

function renderTabla() {
  const head = document.getElementById("tabla-head");
  const body = document.getElementById("tabla-body");
  const campos = APP.ENTITY.fields;
  head.innerHTML = campos.map(c => `<th>${escapar(c.label)}</th>`).join("") + "<th>Acciones</th>";
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const filtrados = registros.filter(r => campos.some(c => String(r[c.key] ?? "").toLowerCase().includes(filtro)));
  body.innerHTML = "";
  if (!filtrados.length) {
    body.innerHTML = `<tr><td colspan="${campos.length+1}">Sin registros</td></tr>`;
    return;
  }
  filtrados.forEach(r => {
    const tr = document.createElement("tr");
    campos.forEach(c => {
      const td = document.createElement("td");
      td.textContent = r[c.key] ?? "";
      tr.appendChild(td);
    });
    const td = document.createElement("td");
    td.innerHTML = `<button class="btn btn-sm btn-outline-info me-1" data-action="detail">Ver</button>
                    <button class="btn btn-sm btn-outline-primary me-1" data-action="edit">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-action="delete">Borrar</button>`;
    td.querySelector('[data-action="detail"]').onclick = () => verDetalle(r);
    td.querySelector('[data-action="edit"]').onclick = () => cargarEdicion(r);
    td.querySelector('[data-action="delete"]').onclick = () => borrarRegistro(r[APP.ENTITY.idField]);
    tr.appendChild(td);
    body.appendChild(tr);
  });
}

function verDetalle(registro) {
  document.getElementById("modal-titulo").textContent = APP.ENTITY.singular;
  const contenido = document.getElementById("modal-contenido");
  contenido.replaceChildren();
  APP.ENTITY.fields.forEach(c => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = c.label + ": ";
    p.append(strong, document.createTextNode(registro[c.key] ?? ""));
    contenido.appendChild(p);
  });
  bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-detalle")).show();
}

function cargarEdicion(r) {
  document.getElementById("registro-id").value = r[APP.ENTITY.idField];
  document.getElementById("campo-nombre").value = r[APP.ENTITY.payload.nombre] ?? r.nombre ?? "";
  document.getElementById("campo-descripcion").value = r[APP.ENTITY.payload.descripcion] ?? r.descripcion ?? "";
  document.getElementById("campo-valor").value = r[APP.ENTITY.payload.valor] ?? r.valor ?? "";
  document.getElementById("campo-extra").value = r[APP.ENTITY.payload.extra] ?? r.categoria ?? "";
  document.getElementById("titulo-form").textContent = "Editar " + APP.ENTITY.singular;
  mostrarVista("vista-formulario");
}

async function guardarRegistro(event) {
  event.preventDefault();
  const id = document.getElementById("registro-id").value;
  const p = APP.ENTITY.payload;
  const valores = {
    [p.nombre]: document.getElementById("campo-nombre").value.trim(),
    [p.descripcion]: document.getElementById("campo-descripcion").value.trim(),
    [p.valor]: document.getElementById("campo-valor").value,
    [p.extra]: document.getElementById("campo-extra").value.trim()
  };
  try {
    if (!valores[p.nombre] || !valores[p.descripcion]) throw new Error("Completá los campos obligatorios.");
    if (id) valores[APP.ENTITY.idField] = id;
    await api.post(id ? APP.ENDPOINTS.update : APP.ENDPOINTS.create, valores, true);
    mostrarMensaje("mensaje-entidad", "Registro guardado correctamente.");
    limpiarFormulario();
    await cargarRegistros();
    mostrarVista("vista-listado");
  } catch(e) { mostrarMensaje("mensaje-entidad", e.message, true); }
}

async function borrarRegistro(id) {
  if (!confirm("¿Confirmás la eliminación?")) return;
  try {
    await api.post(APP.ENDPOINTS.delete, {[APP.ENTITY.idField]:id}, true);
    await cargarRegistros();
  } catch(e) { alert(e.message); }
}

function limpiarFormulario() {
  document.getElementById("form-entidad").reset();
  document.getElementById("registro-id").value = "";
  document.getElementById("titulo-form").textContent = "Registrar " + APP.ENTITY.singular;
}

function escapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
