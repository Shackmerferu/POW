document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-imagen");
  if (!form) return;
  const input = document.getElementById("img-archivo");
  input.addEventListener("change", completarDesdeMetadatos);
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const archivo = input.files[0];
    if (!archivo || !archivo.type.startsWith("image/")) {
      mostrarMensaje("mensaje-imagen", "Seleccioná un archivo de imagen válido.", true);
      return;
    }
    const fd = new FormData();
    fd.append(APP.IMAGE.fileField, archivo);
    fd.append(APP.IMAGE.nameField, document.getElementById("img-nombre").value.trim());
    fd.append(APP.IMAGE.descriptionField, document.getElementById("img-descripcion").value.trim());
    fd.append(APP.IMAGE.altField, document.getElementById("img-alt").value.trim());
    fd.append(APP.IMAGE.imageTitleField, document.getElementById("img-titulo-imagen").value.trim());
    fd.append(APP.IMAGE.longDescriptionField, document.getElementById("img-descripcion-larga").value.trim());
    fd.append(APP.IMAGE.headlineField, document.getElementById("img-nombre").value.trim());
    try {
      await api.upload(APP.ENDPOINTS.upload, fd);
      mostrarMensaje("mensaje-imagen", "Archivo enviado correctamente.");
      form.reset();
      await cargarRegistros();
    } catch(err) { mostrarMensaje("mensaje-imagen", err.message, true); }
  });
});

async function completarDesdeMetadatos(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;
  if (!archivo.type.startsWith("image/")) {
    mostrarMensaje("mensaje-imagen", "El archivo no es una imagen.", true);
    event.target.value = "";
    return;
  }
  try {
    if (typeof ExifReader === "undefined") throw new Error("No se cargó ExifReader.");
    const tags = await ExifReader.load(archivo);
    const valor = (...keys) => {
      for (const key of keys) {
        const tag = tags[key];
        if (tag?.description) return tag.description;
        if (tag?.value) return Array.isArray(tag.value) ? tag.value.join(", ") : String(tag.value);
      }
      return "";
    };
    const headline = valor("Headline", "headline");
    const title = valor("ObjectName", "Object Name", "Title", "title");
    const description = valor("Caption-Abstract", "Caption", "Description");
    const alt = valor("AltTextAccessibility", "Alt Text Accessibility");
    const long = valor("ExtDescrAccessibility", "ExtendedDescriptionAccessibility");
    if (headline) document.getElementById("img-nombre").value = headline;
    if (title) document.getElementById("img-titulo-imagen").value = title;
    if (description) document.getElementById("img-descripcion").value = description;
    if (alt) document.getElementById("img-alt").value = alt;
    if (long) document.getElementById("img-descripcion-larga").value = long;
  } catch (error) {
    console.warn("No se pudieron leer metadatos IPTC:", error);
    mostrarMensaje("mensaje-imagen", "No se pudieron leer metadatos; completá los campos manualmente.", true);
  }
}
