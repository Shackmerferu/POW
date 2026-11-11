// ======================================
// ELEMENTOS HTML
// ======================================

// Formulario
const formAgregarTermo = document.getElementById("formAgregarTermo");

// Input de imagen
const inputImagen = document.getElementById("imagenTermo");

// Campos
const tituloTermo = document.getElementById("tituloTermo");

const tituloImagenTermo = document.getElementById("tituloImagenTermo");

const descripcionTermo = document.getElementById("descripcionTermo");

const textoAlternativoTermo = document.getElementById("textoAlternativoTermo");

const descripcionLargaTermo = document.getElementById("descripcionLargaTermo");

// ======================================
// CONFIGURAR CAMPOS OBLIGATORIOS
// ======================================

inputImagen.required = true;

tituloTermo.required = true;
tituloImagenTermo.required = true;
descripcionTermo.required = true;
textoAlternativoTermo.required = true;
descripcionLargaTermo.required = true;

// ======================================
// OBTENER TEXTO DE UN METADATO
// ======================================

function obtenerValorMetadato(tags, nombres) {
  for (let i = 0; i < nombres.length; i++) {
    const etiqueta = tags[nombres[i]];

    if (etiqueta) {
      if (etiqueta.description) {
        return etiqueta.description;
      }

      if (etiqueta.value) {
        if (Array.isArray(etiqueta.value)) {
          return etiqueta.value.join(", ");
        }

        return String(etiqueta.value);
      }
    }
  }

  return "";
}

// ======================================
// EXTRAER METADATOS IPTC DE LA IMAGEN
// ======================================

async function extraerMetadatos(archivo) {
  if (!archivo) {
    return;
  }

  // Comprobar que sea una imagen
  if (!archivo.type.startsWith("image/")) {
    alert("El archivo seleccionado no es una imagen.");

    inputImagen.value = "";

    return;
  }

  // Limpiar campos anteriores
  tituloTermo.value = "";
  tituloImagenTermo.value = "";
  descripcionTermo.value = "";
  textoAlternativoTermo.value = "";
  descripcionLargaTermo.value = "";

  try {
    // Comprobar que la librería esté cargada
    if (typeof ExifReader === "undefined") {
      throw new Error("No se pudo cargar la librería ExifReader.");
    }

    // Leer archivo como ArrayBuffer
    const buffer = await archivo.arrayBuffer();

    // Extraer metadatos
    const tags = ExifReader.load(buffer);

    console.log("========== METADATOS IPTC ==========");
    console.log("Nombre:", archivo.name);
    console.log("Tipo:", archivo.type);
    console.log("Tamaño:", archivo.size, "bytes");
    console.log("Metadatos encontrados:", tags);

    // Extraer campos IPTC
    const titulo = obtenerValorMetadato(tags, ["Headline", "headline"]);

    const tituloImagen = obtenerValorMetadato(tags, [
      "ObjectName",
      "Object Name",
      "title",
      "Title",
    ]);

    const descripcion = obtenerValorMetadato(tags, [
      "Caption-Abstract",
      "Caption/Abstract",
      "Caption",
    ]);

    const textoAlternativo = obtenerValorMetadato(tags, [
      "AltTextAccessibility",
      "Alt Text Accessibility",
    ]);

    const descripcionLarga = obtenerValorMetadato(tags, [
      "ExtDescrAccessibility",
      "ExtendedDescriptionAccessibility",
    ]);

    // Completar formulario
    tituloTermo.value = titulo;
    tituloImagenTermo.value = tituloImagen;
    descripcionTermo.value = descripcion;
    textoAlternativoTermo.value = textoAlternativo;
    descripcionLargaTermo.value = descripcionLarga;

    // Mostrar metadatos en consola
    console.log("Título:", titulo);
    console.log("Título de imagen:", tituloImagen);
    console.log("Descripción:", descripcion);
    console.log("Texto alternativo:", textoAlternativo);
    console.log("Descripción larga:", descripcionLarga);

    // Obtener dimensiones de la imagen
    const imagenTemporal = new Image();

    const urlTemporal = URL.createObjectURL(archivo);

    imagenTemporal.onload = function () {
      console.log("Ancho:", imagenTemporal.width, "px");
      console.log("Alto:", imagenTemporal.height, "px");

      URL.revokeObjectURL(urlTemporal);
    };

    imagenTemporal.onerror = function () {
      console.log("No se pudieron obtener las dimensiones.");

      URL.revokeObjectURL(urlTemporal);
    };

    imagenTemporal.src = urlTemporal;

    console.log("====================================");

    // Avisar si no se encontraron metadatos
    if (
      !titulo &&
      !tituloImagen &&
      !descripcion &&
      !textoAlternativo &&
      !descripcionLarga
    ) {
      alert(
        "La imagen no contiene los metadatos IPTC esperados. " +
          "Los campos deberán completarse manualmente.",
      );
    }
  } catch (error) {
    console.error("Error al extraer los metadatos:", error);

    alert(error.message);
  }
}

// ======================================
// EVENTO AL SELECCIONAR UNA IMAGEN
// ======================================

inputImagen.addEventListener("change", async function () {
  const archivo = inputImagen.files[0];

  await extraerMetadatos(archivo);
});

// ======================================
// ENVIAR FORMULARIO DE TERMO
// ======================================

formAgregarTermo.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!window.verificarSesion()) {
    return;
  }

  try {
    // Obtener imagen
    const archivo = inputImagen.files[0];

    if (!archivo) {
      throw new Error("Debe seleccionar una imagen.");
    }

    // Comprobar campos
    if (
      !tituloTermo.value.trim() ||
      !tituloImagenTermo.value.trim() ||
      !descripcionTermo.value.trim() ||
      !textoAlternativoTermo.value.trim() ||
      !descripcionLargaTermo.value.trim()
    ) {
      throw new Error("Todos los campos deben estar completos.");
    }

    // Obtener token
    const token = sessionStorage.getItem("termos_token");

    // Crear FormData
    const datos = new FormData();

    datos.append("titulo", tituloTermo.value.trim());
    datos.append("titulo_imagen", tituloImagenTermo.value.trim());
    datos.append("descripcion", descripcionTermo.value.trim());
    datos.append("texto_alternativo", textoAlternativoTermo.value.trim());
    datos.append("descripcion_larga", descripcionLargaTermo.value.trim());

    // Adjuntar archivo
    datos.append("imagen", archivo);

    console.log("Datos enviados:", [...datos.entries()]);

    // Enviar a PHP
    const response = await fetch(
      window.API + "registrar_productos.php?token=" + encodeURIComponent(token),
      {
        method: "POST",
        body: datos,
      },
    );

    if (!response.ok) {
      throw new Error("Error HTTP al registrar el termo: " + response.status);
    }

    const respuesta = await response.json();

    console.log("Respuesta al registrar termo:", respuesta);

    // Comprobar resultado de PHP
    if (respuesta.status !== 200 && respuesta.status !== "200") {
      throw new Error(
        respuesta.mensaje ||
          respuesta.message ||
          "No se pudo registrar el termo.",
      );
    }

    // Cerrar modal
    const modalElemento = document.getElementById("modalAgregarTermo");

    const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

    modal.hide();

    // Limpiar formulario
    formAgregarTermo.reset();

    // Actualizar listado
    const listadoActualizado = await cargarTermos();

    // Mostrar sección de termos
    window.cambiarVista("termos", false);
    if (!listadoActualizado) {
      alert(
        "El termo fue registrado, pero no se pudo actualizar el listado. " +
          "Revisá la consola para conocer el error.",
      );

      return;
    }

    alert("El termo fue registrado correctamente.");
  } catch (error) {
    console.error("Error al registrar termo:", error);

    alert(error.message);
  }
});
