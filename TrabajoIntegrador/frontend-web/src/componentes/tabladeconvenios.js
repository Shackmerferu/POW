/**
 * LISTADO DE CONVENIOS — componente listo para usar en la página de búsqueda.
 *
 * USO (dentro de src/pages/convenios/convenios.js):
 *
 *   import TablaConvenios from "../../componentes/tabladeconvenios";
 *
 *   <TablaConvenios
 *     convenios={resultados}        // la lista ya filtrada que devuelve tu búsqueda
 *     conveniosCatalogo={catalogo}  // lista completa para resolver relaciones de la ficha
 *     unidades={unidades}
 *   />
 *
 * Cada convenio se muestra como una "carta alargada" (estilo listado de
 * termos): código a la izquierda como bloque destacado, título y descripción
 * a la derecha, y clic en la tarjeta para abrir la ficha en modal.
 * El listado scrollea verticalmente dentro del contenedor de la página,
 * sin expandirse al resto de la pantalla.
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

const FILAS_POR_PAGINA = 6;

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

  const tarjetasPagina = useMemo(() => {
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
      <ListaConvenios mensajeVacio={mensajeVacio}>
        {tarjetasPagina.map((convenio) => (
          <article
            key={convenio.id ?? convenio.codigo_unico}
            className="convenios-tarjeta"
            role="button"
            tabIndex={0}
            onClick={() => abrirDetalle(convenio)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                abrirDetalle(convenio);
              }
            }}
          >
            {/* Bloque izquierdo: ocupa el lugar de la imagen del card */}
            <div className="convenios-tarjeta__codigo" aria-hidden="true">
              <span className="convenios-tarjeta__codigo-etiqueta">Código</span>
              <span className="convenios-tarjeta__codigo-valor">
                {convenio.codigo_unico ?? "—"}
              </span>
            </div>

            {/* Bloque derecho: título + descripción, como el card del termo */}
            <div className="convenios-tarjeta__texto">
              <h3 className="convenios-tarjeta__titulo">
                {convenio.titulo ?? "Convenio sin título"}
              </h3>
              <p className="convenios-tarjeta__descripcion">
                {recortarTexto(convenio.objeto, 140)}
              </p>
              <div className="convenios-tarjeta__meta">
                <EtiquetaTipo tipo={convenio.tipo} />
                <EtiquetaEstado estado={convenio.estado} />
                {mostrarUnidad && (
                  <span className="convenios-tarjeta__dato">
                    {nombreUnidad(unidades, convenio.id_unidad_responsable)}
                  </span>
                )}
                <span className="convenios-tarjeta__dato">
                  Firma: {formatoFecha(convenio.fecha_firma)}
                </span>
              </div>
            </div>

            {/* Velo "Abrir": aparece al pasar el mouse sobre la tarjeta */}
            <span className="convenios-tarjeta__abrir" aria-hidden="true">
              Abrir
            </span>
          </article>
        ))}
      </ListaConvenios>

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
 * LISTA — contenedor con scroll vertical propio. Ocupa el alto del
 * panel de resultados de la página sin derramarse al resto de pantalla.
 * ------------------------------------------------------------------ */
function ListaConvenios({ mensajeVacio, children }) {
  // Si no hay tarjetas, se muestra el estado vacío (children queda vacío).
  if (React.Children.count(children) === 0) {
    return <DatosVacios mensaje={mensajeVacio} />;
  }

  return <div className="convenios-lista">{children}</div>;
}
