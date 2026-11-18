/**
 * AVISO FLOTANTE — notificaciones emergentes (tipo popup) del panel.
 * Aparecen apiladas arriba a la derecha con una animación de entrada
 * deslizante y desaparecen solas (el panel las retira a los 6 s).
 *
 * Tipos: "exito" (alta), "info" (modificaciones neutras), "baja" (estado
 * final tipo rescindido/archivado) y "error" (fallos de operación).
 *
 * @param {Array<{id: number|string, titulo: string, texto: string, tipo: string}>} avisos
 * @param {Function} alDescartar (id) => retira el aviso manualmente
 */
export default function AvisoFlotante({ avisos, alDescartar }) {
  if (!avisos || avisos.length === 0) return null;

  return (
    <div className="avisos-flotantes" aria-live="polite">
      {avisos.map((aviso) => (
        <div
          key={aviso.id}
          className={`aviso-flotante aviso-flotante--${aviso.tipo ?? "info"}`}
          role="status"
        >
          <span className="aviso-flotante__icono" aria-hidden="true">
            {aviso.tipo === "exito"
              ? "✓"
              : aviso.tipo === "baja"
                ? "⏻"
                : aviso.tipo === "error"
                  ? "!"
                  : "i"}
          </span>
          <div className="aviso-flotante__cuerpo">
            <strong className="aviso-flotante__titulo">{aviso.titulo}</strong>
            {aviso.texto && <p className="aviso-flotante__texto">{aviso.texto}</p>}
          </div>
          <button
            type="button"
            className="aviso-flotante__cerrar"
            onClick={() => alDescartar(aviso.id)}
            aria-label="Descartar aviso"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
