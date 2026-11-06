/**
 * TABLA CONVENIOS — componente listo para usar en la página de búsqueda.
 *
 * USO (dentro de src/pages/convenios/convenios.js):
 *
 *   import TablaConvenios from "../../componentes/tabladeconvenios";
 *   import { CONVENIOS, UNIDADES } from "../../datos/datosPanel";
 *
 *   // dentro del render, reemplazando el bloque "no hay resultados":
 *   <TablaConvenios
 *     convenios={CONVENIOS}      // la lista ya filtrada que devuelve tu búsqueda
 *     conveniosCatalogo={CONVENIOS} // lista completa para resolver relaciones de la ficha
 *     unidades={UNIDADES}
 *   />
 *
 * Estado interno: paginación propia y ficha de detalle en modal. Si la
 * página prefiere manejar el "Ver detalle" por su cuenta, puede pasar
 * `onVerDetalle={(convenio) => ...}` y el componente no abre el modal solo.
 */

import React, { useEffect, useMemo, useState } from "react";
import "./componentes.css";

import DatosVacios from "./DatosVacios";
import Paginacion from "./Paginacion";
import FichaDetalle from "./FichaDetalle";
import { EtiquetaEstado, EtiquetaTipo } from "./Etiqueta";
import { formatoEntero, formatoFecha, nombreUnidad, recortarTexto } from "../utils/formatos";

const FILAS_POR_PAGINA = 8;

export default function TablaConvenios({
  convenios = [],
  conveniosCatalogo = null,
  unidades = [],
  filasPorPagina = FILAS_POR_PAGINA,
  mensajeVacio = "No hay resultados que mostrar, intente nuevamente.",
  onVerDetalle = null,
  mostrarUnidad = true,
}) {
  // ------------------------------------------------------------------
  // Paginación interna: se resetea cuando cambia el listado (por ejemplo
  // cuando la página aplique sus filtros del formulario de búsqueda).
  // ------------------------------------------------------------------
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setPagina(1);
  }, [convenios]);

  const totalPaginas = Math.max(1, Math.ceil(convenios.length / filasPorPagina));

  const filasPagina = useMemo(() => {
    const inicio = (pagina - 1) * filasPorPagina;
    return convenios.slice(inicio, inicio + filasPorPagina);
  }, [convenios, pagina, filasPorPagina]);

  // ------------------------------------------------------------------
  // Ficha de detalle: interna por defecto; delegada si llega onVerDetalle.
  // ------------------------------------------------------------------
  const [detalleActual, setDetalleActual] = useState(null);

  const abrirDetalle = (convenio) => {
    if (typeof onVerDetalle === "function") {
      onVerDetalle(convenio);
      return;
    }
    setDetalleActual(convenio);
  };

  return (
    <div className="tablaconvenios">
      <Tabla mensajeVacio={mensajeVacio}>
        {filasPagina.map((convenio) => (
          <tr key={convenio.id ?? convenio.codigo_unico}>
            <td className="tabla__celda-principal">{convenio.codigo_unico}</td>
            <td className="tabla__celda">{recortarTexto(convenio.titulo, 55)}</td>
            <td><EtiquetaTipo tipo={convenio.tipo} /></td>
            <td><EtiquetaEstado estado={convenio.estado} /></td>
            {mostrarUnidad && (
              <td className="tabla__celda-neutra">
                {nombreUnidad(unidades, convenio.id_unidad_responsable)}
              </td>
            )}
            <td className="tabla__celda-neutra">{formatoFecha(convenio.fecha_firma)}</td>
            <td>
              <button type="button" className="tabla__accion" onClick={() => abrirDetalle(convenio)}>
                Ficha
              </button>
            </td>
          </tr>
        ))}
      </Tabla>

      <div className="tablaconvenios__pie">
        <p className="tablaconvenios__total">
          {formatoEntero(convenios.length)} convenio(s) en el listado
        </p>
        <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={setPagina} />
      </div>

      {!onVerDetalle && (
        <FichaDetalle
          convenio={detalleActual}
          convenios={conveniosCatalogo ?? convenios}
          unidades={unidades}
          onCerrar={() => setDetalleActual(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
 * TABLA — cuerpo base (mismo estilo de las demás tablas del panel).
 * ------------------------------------------------------------------ */
function Tabla({ mensajeVacio, children }) {
  // Si no hay filas, se muestra el estado vacío (children queda vacío).
  if (React.Children.count(children) === 0) {
    return <DatosVacios mensaje={mensajeVacio} />;
  }

  return (
    <div className="tabla-envoltura">
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Unidad</th>
            <th>Firma</th>
            <th>Ficha</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
