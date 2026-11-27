import React from "react";

/**
 * AVISO FLOTANTE — notificaciones emergentes del panel construidas con
 * toasts de Bootstrap 5. El panel las activa como componente cada vez que
 * se realiza una acción de estado (alta, modificación, baja) o falla una
 * operación; se retiran solas a los 6 s y pueden cerrarse a mano.
 *
 * Tipos: "exito" (alta), "info" (modificaciones neutras), "baja" (estado
 * final tipo rescindido/archivado) y "error" (fallos de operación).
 *
 * @param {Array<{id: number|string, titulo: string, texto: string, tipo: string}>} avisos
 * @param {Function} alDescartar (id) => retira el aviso manualmente
 */
const COLOR_BOOSTRAP = {
  exito: "success",
  info: "primary",
  baja: "danger",
  error: "warning",
};

export default function AvisoFlotante({ avisos, alDescartar }) {
  if (!avisos || avisos.length === 0) return null;

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1080 }}
      aria-live="polite"
    >
      {avisos.map((aviso) => {
        const color = COLOR_BOOSTRAP[aviso.tipo] ?? "primary";
        const textoOscuro = color === "warning";

        return (
          <div
            key={aviso.id}
            className="toast show"
            role="status"
            aria-atomic="true"
          >
            <div
              className={`toast-header bg-${color} ${
                textoOscuro ? "text-dark" : "text-white"
              }`}
            >
              <strong className="me-auto">{aviso.titulo}</strong>
              <button
                type="button"
                className={`btn-close${textoOscuro ? "" : " btn-close-white"}`}
                onClick={() => alDescartar(aviso.id)}
                aria-label="Cerrar aviso"
              />
            </div>
            {aviso.texto && (
              <div className={`toast-body${textoOscuro ? "" : " text-muted"}`}>
                {aviso.texto}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
