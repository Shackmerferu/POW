/* ============================================================
   panel.js - Logica de panel.html
   ------------------------------------------------------------
   Secciones:
   1. Inicializacion y control de sesion.
   2. Navegacion entre "Termos" y "Personas".
   3. Listado y modal de termos.
   4. Carga de un termo nuevo (imagen + metadatos + POST).
   5. Personas: busqueda binaria por DNI + alta / edicion.
   ============================================================ */

"use strict";

let token = null;

let productos = [];
let productosPorId = new Map();

let ciudades = [];
let modoPersona = null;       // "crear" | "editar"
let personaActual = null;

/* ============================================================
   1. INICIALIZACION
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  token = await App.requireSession();

  // requireSession redirige si no hay token valido.
  if (!token) return;

  mostrarUsuario();
  configurarNavegacion();
  configurarLogout();
  configurarListado();
  configurarFormularioTermo();
  configurarPersonas();

  // Recien ahora se muestra la aplicacion: evita el "flash" de
  // contenido protegido antes de verificar la sesion.
  document.getElementById("auth-loading").classList.add("d-none");
  document.getElementById("app").classList.remove("d-none");

  await Promise.all([
    cargarTermos(),
    cargarCiudades()
  ]);
});

function mostrarUsuario() {
  const usuario = App.getUsuario();
  const nombre = [usuario?.nombre, usuario?.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  document.getElementById("usuario-logueado").textContent =
    nombre || "Usuario";
}

function configurarNavegacion() {
  document.querySelectorAll("[data-view]").forEach((boton) => {
    boton.addEventListener("click", () => {
      mostrarVista(boton.dataset.view);
    });
  });
}

function mostrarVista(nombreVista) {
  const esTermos = nombreVista === "termos";

  document.getElementById("vista-termos")
    .classList.toggle("d-none", !esTermos);

  document.getElementById("vista-personas")
    .classList.toggle("d-none", esTermos);

  document.querySelectorAll(".nav-view").forEach((boton) => {
    const activo = boton.dataset.view === nombreVista;
    boton.classList.toggle("active", activo);

    if (activo) {
      boton.setAttribute("aria-current", "page");
    } else {
      boton.removeAttribute("aria-current");
    }
  });

  // En pantallas chicas, cerrar el menu despues de elegir una opcion.
  const menu = document.getElementById("menuPrincipal");
  if (menu.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }

  if (!esTermos) {
    document.getElementById("dni-buscar").focus();
  }
}

function configurarLogout() {
  document.getElementById("btn-salir").addEventListener("click", () => {
    // Punto extra del enunciado: confirmar antes de salir.
    const seguro = window.confirm("¿Esta seguro de que desea cerrar sesion?");

    if (!seguro) return;

    App.clearSession();
    window.location.replace("index.html");
  });
}

/* ============================================================
   2. LISTADO DE TERMOS
   ============================================================ */

async function cargarTermos() {
  const estado = document.getElementById("estado-termos");
  const grid = document.getElementById("grid-termos");

  estado.classList.remove("d-none");
  estado.textContent = "Cargando termos...";
  grid.innerHTML = "";

  try {
    const datos = await App.getJSON(API.listarProductos, { token: token });

    if (datos.status !== 200) {
      const mensaje = datos.menssage || datos.mensaje || "No se pudo listar.";

      // La API devuelve status 500 (no HTTP 401) cuando el token
      // no existe o fue reemplazado por otro login.
      if (/desautorizado|token/i.test(mensaje)) {
        App.clearSession();
        App.redirectToLogin();
        return;
      }

      // La API tambien devuelve 500 cuando la tabla esta vacia.
      // En ese caso no es un error: se muestra el estado vacio.
      if (/algo malo paso/i.test(mensaje)) {
        productos = [];
        productosPorId = new Map();
        estado.innerHTML = '<p class="mb-0">No hay termos cargados todavía.</p>';
        return;
      }

      throw new Error(mensaje);
    }

    // La API no ordena. El enunciado pide ordenar por titulo en el front.
    productos = (Array.isArray(datos.data) ? datos.data : [])
      .slice()
      .sort((a, b) => {
        return String(a.titulo ?? "").localeCompare(
          String(b.titulo ?? ""),
          "es",
          { sensitivity: "base" }
        );
      });

    productosPorId = new Map(
      productos.map((producto) => [String(producto.id), producto])
    );

    if (productos.length === 0) {
      estado.classList.remove("d-none");
      estado.innerHTML = "<p class=\"mb-0\">No hay termos cargados todavía.</p>";
      return;
    }

    estado.classList.add("d-none");
    grid.innerHTML = productos.map(renderizarProducto).join("");

  } catch (error) {
    estado.classList.remove("d-none");
    estado.innerHTML = `
      <p class="text-danger mb-0">
        No se pudo cargar el listado: ${App.escapeHtml(error.message)}
      </p>
    `;
    App.showAlert(document.getElementById("alertas"), error.message, "danger");
  }
}

function renderizarProducto(producto) {
  const id = App.escapeHtml(producto.id);
  const titulo = App.escapeHtml(producto.titulo);
  const tituloImagen = App.escapeHtml(producto.titulo_imagen || producto.titulo);
  const textoAlternativo = App.escapeHtml(
    producto.texto_alternativo || producto.titulo
  );
  const descripcionLarga = App.escapeHtml(producto.descripcion_larga || "");
  const descripcion = App.escapeHtml(producto.descripcion || "");
  const src = producto.imagen
    ? App.escapeHtml(App.imageUrl(producto.imagen))
    : "";

  const imagen = src
    ? `
      <button type="button" class="producto-imagen-btn"
              data-ver="${id}"
              aria-label="Ampliar imagen de ${titulo}">
        <img src="${src}"
             class="card-img-top"
             alt="${textoAlternativo}"
             title="${tituloImagen}"
             aria-description="${descripcionLarga}"
             loading="lazy">
        <span class="producto-imagen-hint" aria-hidden="true">Ampliar</span>
      </button>
    `
    : `
      <div class="product-image-placeholder">
        <span>Sin imagen</span>
      </div>
    `;

  return `
    <div class="col-12 col-sm-6 col-xl-4">
      <article class="producto-card card h-100">

        ${imagen}

        <div class="card-body">
          <h3 class="card-title">${titulo}</h3>
          <p class="card-text">${descripcion}</p>

          <button type="button"
                  class="btn btn-outline-success mt-auto align-self-start"
                  data-ver="${id}">
            Ver detalle
          </button>
        </div>

      </article>
    </div>
  `;
}

function configurarListado() {
  document.getElementById("grid-termos").addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-ver]");
    if (!boton) return;

    abrirModalProducto(boton.dataset.ver);
  });
}

function abrirModalProducto(id) {
  const producto = productosPorId.get(String(id));

  if (!producto) return;

  document.getElementById("ver-titulo").textContent =
    producto.titulo || "Termo";

  const imagen = document.getElementById("ver-imagen");
  const contenedor = imagen.parentElement;

  let placeholder = document.getElementById("ver-placeholder");

  if (!placeholder) {
    placeholder = document.createElement("div");
    placeholder.id = "ver-placeholder";
    placeholder.className = "product-image-placeholder";
    placeholder.textContent = "Sin imagen";
    contenedor.appendChild(placeholder);
  }

  if (producto.imagen) {
    imagen.src = App.imageUrl(producto.imagen);
    imagen.alt = producto.texto_alternativo || producto.titulo || "";
    imagen.title = producto.titulo_imagen || producto.titulo || "";
    imagen.setAttribute(
      "aria-description",
      producto.descripcion_larga || ""
    );
    imagen.classList.remove("d-none");
    placeholder.classList.add("d-none");
  } else {
    imagen.classList.add("d-none");
    placeholder.classList.remove("d-none");
  }

  document.getElementById("ver-descripcion").textContent =
    producto.descripcion_larga ||
    producto.descripcion ||
    "Sin descripcion.";

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("modalVerTermo")
  ).show();
}

/* ============================================================
   3. CARGA DE UN TERMO NUEVO
   ============================================================ */

function configurarFormularioTermo() {
  const formulario = document.getElementById("form-termo");
  const archivo = document.getElementById("termo-imagen");
  const alertas = document.getElementById("termo-alert");
  const preview = document.getElementById("preview-termo");
  const previewImagen = document.getElementById("preview-termo-img");
  const botonGuardar = document.getElementById("btn-guardar-termo");

  let previewUrl = null;

  function limpiarFormulario() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    App.clearAlert(alertas);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }

    preview.classList.add("d-none");
    previewImagen.removeAttribute("src");
  }

  archivo.addEventListener("change", async () => {
    App.clearAlert(alertas);

    const imagen = archivo.files[0];

    if (!imagen) {
      preview.classList.add("d-none");
      return;
    }

    if (!imagen.type.startsWith("image/")) {
      App.showAlert(alertas, "El archivo seleccionado no es una imagen.", "danger");
      archivo.value = "";
      preview.classList.add("d-none");
      return;
    }

    // Limite defensivo. Las imagenes del parcial pesan menos de 500 KB.
    if (imagen.size > 8 * 1024 * 1024) {
      App.showAlert(alertas, "La imagen supera los 8 MB permitidos.", "danger");
      archivo.value = "";
      preview.classList.add("d-none");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(imagen);
    previewImagen.src = previewUrl;
    previewImagen.alt = `Vista previa de ${imagen.name}`;
    preview.classList.remove("d-none");

    try {
      const metadatos = await Metadatos.leer(imagen);

      formulario.elements.titulo.value = metadatos.titulo;
      formulario.elements.titulo_imagen.value = metadatos.titulo_imagen;
      formulario.elements.descripcion.value = metadatos.descripcion;
      formulario.elements.descripcion_larga.value = metadatos.descripcion_larga;
      formulario.elements.texto_alternativo.value = metadatos.texto_alternativo;

      const completo =
        metadatos.titulo &&
        metadatos.descripcion &&
        metadatos.texto_alternativo;

      if (completo) {
        App.showAlert(
          alertas,
          "Metadatos cargados. Revisá los textos antes de guardar.",
          "success"
        );
      } else {
        App.showAlert(
          alertas,
          "La imagen no tiene todos los metadatos. Completá los campos vacíos manualmente.",
          "warning"
        );
      }
    } catch (error) {
      App.showAlert(
        alertas,
        "No se pudieron leer los metadatos: " + error.message +
        ". Completá los campos manualmente.",
        "warning"
      );
    }
  });

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    App.clearAlert(alertas);

    if (!formulario.checkValidity()) {
      formulario.classList.add("was-validated");
      return;
    }

    const imagen = archivo.files[0];

    if (!imagen) {
      App.showAlert(alertas, "Seleccioná una imagen antes de guardar.", "danger");
      return;
    }

    App.setLoading(botonGuardar, true, "Guardando...");

    const datos = new FormData();
    datos.append("titulo", formulario.elements.titulo.value.trim());
    datos.append("titulo_imagen", formulario.elements.titulo_imagen.value.trim());
    datos.append("descripcion", normalizarDescripcion(formulario.elements.descripcion.value));
    datos.append("descripcion_larga", formulario.elements.descripcion_larga.value.trim());
    datos.append("texto_alternativo", formulario.elements.texto_alternativo.value.trim());
    datos.append("imagen", imagen);

    try {
      // El token va en la query: la API lo lee con extract($_REQUEST).
      const respuesta = await App.postForm(
        API.registrarProducto,
        datos,
        { token: token }
      );

      if (respuesta.status !== 200) {
        throw new Error(
          respuesta.menssage ||
          respuesta.mensaje ||
          "No se pudo guardar el termo."
        );
      }

      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalTermo")
      ).hide();

      App.showAlert(
        document.getElementById("alertas"),
        "El termo se guardó correctamente.",
        "success"
      );

      await cargarTermos();

    } catch (error) {
      App.showAlert(alertas, error.message, "danger");
    } finally {
      App.setLoading(botonGuardar, false);
    }
  });

  // Al cerrar el modal se limpia todo, incluso si se cancelo.
  document.getElementById("modalTermo")
    .addEventListener("hidden.bs.modal", limpiarFormulario);
}

// La API de registrar_productos.php tiene un typo: calcula
// $descrpicion (con "p" de más) y termina usando $descripcion sin
// escapar. Se escapa la comilla simple y la barra invertida a mano
// para que el INSERT no se rompa y el texto se guarde igual.
// Los demás campos sí los escapa la API, por eso no se tocan.
function normalizarDescripcion(texto) {
  return escaparParaSql(texto);
}

// Misma idea para los endpoints de personas, que no escapan ningún
// campo. Al enviar la barra invertida y la comilla simple escapadas,
// MySQL guarda el valor original (por ejemplo, O'Brien).
function escaparParaSql(texto) {
  return String(texto ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

/* ============================================================
   4. PERSONAS
   ============================================================ */

function configurarPersonas() {
  const formBuscar = document.getElementById("form-buscar-persona");
  const botonBuscar = document.getElementById("btn-buscar-persona");
  const formPersona = document.getElementById("form-persona");
  const botonGuardar = document.getElementById("btn-guardar-persona");
  const alertasPersona = document.getElementById("persona-alert");

  /* -------------------- Busqueda por DNI -------------------- */

  formBuscar.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    App.clearAlert(document.getElementById("alertas"));
    App.clearAlert(alertasPersona);

    if (!formBuscar.checkValidity()) {
      formBuscar.classList.add("was-validated");
      return;
    }

    const dni = Number(document.getElementById("dni-buscar").value);

    if (!Number.isInteger(dni) || dni < 3000000 || dni > 50000000) {
      App.showAlert(
        document.getElementById("alertas"),
        "El DNI debe estar entre 3.000.000 y 50.000.000.",
        "warning"
      );
      return;
    }

    // Ocultar resultados anteriores mientras se busca.
    document.getElementById("persona-form-wrap").classList.add("d-none");
    document.getElementById("persona-exito").classList.add("d-none");

    const estado = document.getElementById("persona-vacio");
    estado.classList.remove("d-none");
    estado.textContent = "Buscando persona...";

    App.setLoading(botonBuscar, true, "Buscando...");

    try {
      const persona = await buscarPersonaPorDni(dni);

      estado.classList.add("d-none");

      if (persona) {
        modoPersona = "editar";
        personaActual = persona;
        await mostrarFormularioPersona(persona, dni);
      } else {
        modoPersona = "crear";
        personaActual = null;
        await mostrarFormularioPersona(null, dni);
      }

    } catch (error) {
      estado.classList.remove("d-none");
      estado.innerHTML = `
        <p class="text-danger mb-0">
          No se pudo consultar la persona: ${App.escapeHtml(error.message)}
        </p>
      `;
      App.showAlert(document.getElementById("alertas"), error.message, "danger");
    } finally {
      App.setLoading(botonBuscar, false);
    }
  });

  /* -------------------- Alta / edicion -------------------- */

  formPersona.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    App.clearAlert(alertasPersona);

    if (!formPersona.checkValidity()) {
      formPersona.classList.add("was-validated");
      return;
    }

    const esEdicion = modoPersona === "editar" && personaActual !== null;

    const valores = {
      nombre: document.getElementById("persona-nombre").value.trim(),
      apellido: document.getElementById("persona-apellido").value.trim(),
      direccion: document.getElementById("persona-direccion").value.trim(),
      ciudad: document.getElementById("persona-ciudad").value,
      provincia: "5",
      email: document.getElementById("persona-email").value.trim(),
      telefono: document.getElementById("persona-telefono").value.trim()
    };

    // La API de personas no escapa los valores. Se escapan en el
    // front para que nombres como O'Brien no rompan el SQL.
    const valoresApi = {
      ...valores,
      nombre: escaparParaSql(valores.nombre),
      apellido: escaparParaSql(valores.apellido),
      direccion: escaparParaSql(valores.direccion),
      email: escaparParaSql(valores.email),
      telefono: escaparParaSql(valores.telefono)
    };

    App.setLoading(
      botonGuardar,
      true,
      esEdicion ? "Actualizando..." : "Guardando..."
    );

    try {
      let respuesta;

      if (esEdicion) {
        respuesta = await App.postUrlEncoded(
          API.personasEditar,
          valoresApi,
          { id: personaActual.id }
        );

        // La API devuelve 505 cuando el UPDATE no modificó filas
        // (por ejemplo, si se envió el mismo formulario sin cambios).
        // Para el usuario la operación es correcta igual.
        if (respuesta.status !== 200 && respuesta.status !== 505) {
          throw new Error(
            respuesta.menssage ||
            respuesta.mensaje ||
            "No se pudieron actualizar los datos."
          );
        }

        mostrarExitoPersona(
          `Los datos de ${valores.nombre} ${valores.apellido} fueron actualizados.`
        );

      } else {
        valoresApi.dni = document.getElementById("persona-dni").value;

        respuesta = await App.postUrlEncoded(API.personasGuardar, valoresApi);

        if (respuesta.status !== 200) {
          throw new Error(
            respuesta.menssage ||
            respuesta.mensaje ||
            "No se pudo guardar la persona."
          );
        }

        mostrarExitoPersona(
          `La persona ${valores.nombre} ${valores.apellido} fue dada de alta con éxito.`
        );
      }

    } catch (error) {
      App.showAlert(alertasPersona, error.message, "danger");
    } finally {
      App.setLoading(botonGuardar, false);
    }
  });

  /* -------------------- Cancelar / reiniciar -------------------- */

  document.getElementById("btn-cancelar-persona")
    .addEventListener("click", () => {
      formPersona.reset();
      formPersona.classList.remove("was-validated");
      App.clearAlert(alertasPersona);

      document.getElementById("persona-form-wrap").classList.add("d-none");

      const estado = document.getElementById("persona-vacio");
      estado.classList.remove("d-none");
      estado.textContent = "Ingresá un DNI y presioná \"Consultar persona\" para comenzar.";
    });
}

async function cargarCiudades() {
  const select = document.getElementById("persona-ciudad");

  try {
    const datos = await App.getJSON(API.ciudades);

    if (datos.status !== 200) {
      throw new Error(datos.menssage || "No se pudieron cargar las ciudades.");
    }

    // La API no ordena: el orden ascendente se hace en el front.
    ciudades = (Array.isArray(datos.localidades) ? datos.localidades : [])
      .slice()
      .sort((a, b) => {
        return String(a.nombre_ciudad ?? "").localeCompare(
          String(b.nombre_ciudad ?? ""),
          "es",
          { sensitivity: "base" }
        );
      });

    select.innerHTML = '<option value="">Seleccioná una ciudad</option>';

    ciudades.forEach((ciudad) => {
      const opcion = document.createElement("option");
      opcion.value = String(ciudad.id);
      opcion.textContent = ciudad.nombre_ciudad;
      select.appendChild(opcion);
    });

  } catch (error) {
    select.innerHTML = '<option value="">No se pudieron cargar las ciudades</option>';
    App.showAlert(document.getElementById("alertas"), error.message, "danger");
  }
}

async function buscarPersonaPorDni(dniBuscado) {
  const cantidadRespuesta = await App.getJSON(API.personasCantidad);

  if (cantidadRespuesta.status !== 200) {
    const mensaje = cantidadRespuesta.menssage || "";

    // La API devuelve 500 cuando la tabla está vacía. En ese caso
    // cualquier DNI es inexistente y corresponde el formulario de alta.
    if (/algo malo paso/i.test(mensaje)) {
      return null;
    }

    throw new Error(mensaje || "No se pudo obtener la cantidad de personas.");
  }

  let inicio = 1;
  let fin = Number(cantidadRespuesta.cantidad);

  // Busqueda binaria: los ID van de 1 a cantidad y estan ordenados
  // por DNI (la API reindexa la tabla cada vez que se consulta).
  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);

    const respuesta = await App.getJSON(
      API.personasListar,
      { id: medio }
    );

    if (
      respuesta.status !== 200 ||
      !Array.isArray(respuesta.persona) ||
      respuesta.persona.length === 0
    ) {
      // No deberia pasar con ID consecutivos, pero evita un bucle.
      fin = medio - 1;
      continue;
    }

    const persona = respuesta.persona[0];
    const dniMedio = Number(persona.dni);

    if (dniMedio === dniBuscado) {
      return persona;
    }

    if (dniMedio < dniBuscado) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }

  return null;
}

async function mostrarFormularioPersona(persona, dniBuscado) {
  const formulario = document.getElementById("form-persona");
  const contenedor = document.getElementById("persona-form-wrap");
  const alertas = document.getElementById("persona-alert");

  formulario.reset();
  formulario.classList.remove("was-validated");
  App.clearAlert(alertas);

  // Si las ciudades fallaron al inicio, reintentar al abrir el formulario.
  if (ciudades.length === 0) {
    await cargarCiudades();
  }

  const esEdicion = persona !== null;

  document.getElementById("persona-form-titulo").textContent =
    esEdicion ? "Actualizar persona" : "Registrar persona";

  document.getElementById("persona-form-descripcion").textContent =
    esEdicion
      ? "El DNI no se puede modificar. Actualizá los datos restantes."
      : `No existe una persona con el DNI ${dniBuscado}. Completá el formulario para darla de alta.`;

  document.getElementById("persona-id").value = persona?.id ?? "";

  const campoDni = document.getElementById("persona-dni");
  campoDni.value = persona?.dni ?? dniBuscado ?? "";
  campoDni.disabled = esEdicion;       // En edicion no se puede modificar.
  campoDni.required = !esEdicion;      // Un campo disabled no se valida.

  document.getElementById("persona-nombre").value = persona?.nombre ?? "";
  document.getElementById("persona-apellido").value = persona?.apellido ?? "";
  document.getElementById("persona-direccion").value = persona?.direccion ?? "";
  document.getElementById("persona-email").value = persona?.email ?? "";
  document.getElementById("persona-telefono").value = persona?.telefono ?? "";

  const selectCiudad = document.getElementById("persona-ciudad");
  selectCiudad.value = persona?.ciudad ? String(persona.ciudad) : "";

  // Si la ciudad de la persona no esta en el listado, agregarla
  // para no perder el valor al actualizar.
  if (persona?.ciudad && selectCiudad.value !== String(persona.ciudad)) {
    const opcion = document.createElement("option");
    opcion.value = String(persona.ciudad);
    opcion.textContent = `Ciudad ${persona.ciudad}`;
    selectCiudad.appendChild(opcion);
    selectCiudad.value = String(persona.ciudad);
  }

  // La provincia siempre es La Pampa (id 5) y está deshabilitada.
  document.getElementById("persona-provincia").value = "5";

  document.getElementById("btn-guardar-persona").textContent =
    esEdicion ? "Actualizar persona" : "Guardar persona";

  contenedor.classList.remove("d-none");
  document.getElementById("persona-exito").classList.add("d-none");
  document.getElementById("persona-vacio").classList.add("d-none");

  contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function mostrarExitoPersona(mensaje) {
  document.getElementById("persona-form-wrap").classList.add("d-none");
  document.getElementById("persona-vacio").classList.add("d-none");

  const exito = document.getElementById("persona-exito");
  document.getElementById("persona-exito-texto").textContent = mensaje;
  exito.classList.remove("d-none");

  exito.scrollIntoView({ behavior: "smooth", block: "center" });
}
