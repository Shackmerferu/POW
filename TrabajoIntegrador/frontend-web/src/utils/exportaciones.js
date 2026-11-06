/**
 * EXPORTACIONES — Descarga de listados desde el panel.
 *
 * csv  → arXivo plano con separador UTF-8 y BOM para Excel.
 *        Neutraliza cualquier celda que pueda interpretarse como fórmula
 *        (=, +, -, @, Tab, CR) anteponiendo un apóstrofo.
 * pdf  → no usamos librerías extra: abrimos una ventana de impresión con
 *        la tabla lista para guardar como PDF del navegador.
 */

/**
 * Antepone un apóstrofo a los valores que Excel/LibreOffice podrían leer
 * como fórmula e "incrustar" contenido ejecutable.
 */
export function neutralizarCelda(valor) {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (/^[=+\-@\t\r]/.test(texto)) return `'${texto}`;
  return texto;
}

/** Escapa un valor para que sea una celda CSV segura (comillas y comas). */
function celdaCsv(valor) {
  if (valor === null || valor === undefined) return "";
  const limpio = String(valor).replace(/\r?\n/g, " ");
  const guardado = neutralizarCelda(limpio);
  return `"${guardado.replace(/"/g, '""')}"`;
}

/**
 * Descarga un CSV con los resultados ya filtrados y en el alcance del usuario.
 *
 * @param {string} nombreArchivo sin extensión ("convenios_filtrados")
 * @param {Array<{titulo: string, clave?: string, valor?: (fila)=>any}>} columnas
 * @param {Array<object>} filas filas a exportar
 */
export function exportarCsv(nombreArchivo, columnas, filas) {
  const cabecera = columnas.map((columna) => celdaCsv(columna.titulo));
  const cuerpo = filas.map((fila) =>
    columnas.map((columna) => {
      const valor = columna.valor ? columna.valor(fila) : fila[columna.clave];
      return celdaCsv(valor);
    })
  );
  const csv = [cabecera, ...cuerpo].map((linea) => linea.join(",")).join("\r\n");

  // BOM para que Excel detecte el UTF-8 y muestre acentos correctamente.
  const bloque = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(bloque);
  enlace.download = `${nombreArchivo}.csv`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(enlace.href);
}

/**
 * Abre una ventana de impresión con la tabla formateada para guardar como PDF.
 *
 * @param {string} titulo título del documento
 * @param {string} fondo  aclaración de alcance / filtros aplicados
 * @param {Array<{titulo: string, clave?: string, valor?: (fila)=>any}>} columnas
 * @param {Array<object>} filas filas a imprimir
 */
export function exportarPdf(titulo, fondo, columnas, filas) {
  const crudos = filas.map((fila) =>
    columnas.map((columna) => {
      const valor = columna.valor ? columna.valor(fila) : fila[columna.clave];
      return neutralizarCelda(valor); // también entra por esta vía
    })
  );

  const th = columnas.map((columna) => `<th>${columna.titulo}</th>`).join("");
  const td = crudos
    .map((fila) => `<tr>${fila.map((valor) => `<td>${String(valor)}</td>`).join("")}</tr>`)
    .join("");

  const ventana = window.open("", "_blank", "width=1100,height=750");
  if (!ventana) return; // el usuario bloquea el popup
  ventana.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${titulo}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 28px; }
    h1 { margin: 0 0 4px; font-size: 16px; color: #0A2A5E; }
    p { margin: 0 0 16px; font-size: 11px; color: #5b6472; }
    table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
    th, td { border: 1px solid #d3d9e2; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #eef2f8; color: #0A2A5E; }
  </style>
</head>
<body>
  <h1>${titulo}</h1>
  <p>${fondo} · Generado el ${new Date().toLocaleString("es-AR")}</p>
  <table>
    <thead><tr>${th}</tr></thead>
    <tbody>${td}</tbody>
  </table>
</body>
</html>`);
  ventana.document.close();
  ventana.focus();
  ventana.print(); // el usuario elige "Guardar como PDF"
}
