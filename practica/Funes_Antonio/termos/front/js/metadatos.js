/* ============================================================
   metadatos.js - Lectura de metadatos IPTC/XMP con ExifReader
   ------------------------------------------------------------
   La API de registrar_productos.php pide:
     titulo, titulo_imagen, descripcion, descripcion_larga,
     texto_alternativo e imagen.

   En las imagenes del parcial los datos vienen en:
     - IPTC:  Headline, Object Name, Caption/Abstract
     - XMP:   title, description, AltTextAccessibility,
              ExtDescrAccessibility, Headline

   ExifReader puede devolver los tags con nombres distintos segun
   el formato. Por eso se prueban varios nombres en orden y se usa
   el primero que tenga contenido.
   ============================================================ */

"use strict";

const Metadatos = (() => {

  function textoDeTag(tag) {
    if (!tag) return "";

    if (typeof tag === "string") {
      return tag.trim();
    }

    // ExifReader normalmente entrega { value, description }.
    const valor = tag.description ?? tag.value;

    if (Array.isArray(valor)) {
      return valor.map((item) => String(item).trim()).filter(Boolean).join("\n");
    }

    return String(valor ?? "").trim();
  }

  function primero(tags, nombres) {
    for (const nombre of nombres) {
      const texto = textoDeTag(tags[nombre]);
      if (texto) return texto;
    }

    return "";
  }

  async function leer(archivo) {
    if (typeof ExifReader === "undefined") {
      throw new Error("La libreria ExifReader no esta cargada.");
    }

    const buffer = await archivo.arrayBuffer();
    const tags = ExifReader.load(buffer);

    return {
      titulo: primero(tags, [
        "Headline",
        "title",
        "Object Name",
        "ImageDescription"
      ]),

      titulo_imagen: primero(tags, [
        "title",
        "Headline",
        "Object Name",
        "ImageDescription"
      ]),

      descripcion: primero(tags, [
        "Caption/Abstract",
        "description",
        "ImageDescription"
      ]),

      descripcion_larga: primero(tags, [
        "ExtDescrAccessibility",
        "description",
        "Caption/Abstract"
      ]),

      texto_alternativo: primero(tags, [
        "AltTextAccessibility",
        "Headline",
        "title"
      ]),

      // Se devuelven por si se quiere depurar desde la consola.
      tags: tags
    };
  }

  return { leer };
})();
