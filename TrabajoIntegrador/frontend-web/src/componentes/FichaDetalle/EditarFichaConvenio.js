import { useEffect, useState } from "react";
import VentanaModal from "../VentanaModal/VentanaModal";

const CAMPOS_INICIALES = {
  titulo: "",
  objeto: "",
  obligaciones: "",
  condiciones_rescision: "",
  condiciones_renovacion: "",
  marco_legal: "",
  resolucion: "",
  expediente: "",
  notas: "",
  fecha_inicio: "",
  fecha_firma: "",
  fecha_vencimiento: "",
  dias_preaviso: "",
  confidencialidad: false,
};

function fechaInput(valor) {
  return valor ? String(valor).slice(0, 10) : "";
}

export default function EditarFichaConvenio({
  convenio,
  abierto,
  onCerrar,
  onGuardar,
}) {
  const [formulario, setFormulario] = useState(CAMPOS_INICIALES);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!convenio) return;

    setFormulario({
      ...CAMPOS_INICIALES,
      ...convenio,
      fecha_inicio: fechaInput(convenio.fecha_inicio),
      fecha_firma: fechaInput(convenio.fecha_firma),
      fecha_vencimiento: fechaInput(convenio.fecha_vencimiento),
      dias_preaviso: convenio.dias_preaviso ?? "",
      confidencialidad: Boolean(convenio.confidencialidad),
    });
    setError("");
  }, [convenio]);

  const cambiarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setError("");

    try {
      await onGuardar({
        titulo: formulario.titulo.trim(),
        objeto: formulario.objeto.trim(),
        obligaciones: formulario.obligaciones.trim(),
        condiciones_rescision: formulario.condiciones_rescision.trim(),
        condiciones_renovacion: formulario.condiciones_renovacion.trim(),
        marco_legal: formulario.marco_legal.trim(),
        resolucion: formulario.resolucion.trim(),
        expediente: formulario.expediente.trim(),
        notas: formulario.notas.trim(),
        fecha_inicio: formulario.fecha_inicio || null,
        fecha_firma: formulario.fecha_firma || null,
        fecha_vencimiento: formulario.fecha_vencimiento || null,
        dias_preaviso:
          formulario.dias_preaviso === ""
            ? null
            : Number(formulario.dias_preaviso),
        confidencialidad: formulario.confidencialidad ? 1 : 0,
      });

      onCerrar();
    } catch (fallo) {
      setError(fallo.message || "No se pudo guardar la ficha.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <VentanaModal
      abierto={abierto}
      titulo={`Editar ficha · ${convenio?.codigo_unico ?? ""}`}
      onCerrar={onCerrar}
    >
      <form className="form-alta" onSubmit={enviar}>
        <label className="form-alta__campo">
          <span>Título *</span>
          <input
            name="titulo"
            value={formulario.titulo}
            onChange={cambiarCampo}
            required
          />
        </label>

        <label className="form-alta__campo">
          <span>Objeto *</span>
          <textarea
            name="objeto"
            value={formulario.objeto}
            onChange={cambiarCampo}
            rows="3"
            required
          />
        </label>

        <label className="form-alta__campo">
          <span>Obligaciones</span>
          <textarea
            name="obligaciones"
            value={formulario.obligaciones}
            onChange={cambiarCampo}
            rows="3"
          />
        </label>

        <label className="form-alta__campo">
          <span>Condiciones de rescisión</span>
          <textarea
            name="condiciones_rescision"
            value={formulario.condiciones_rescision}
            onChange={cambiarCampo}
            rows="3"
          />
        </label>

        <label className="form-alta__campo">
          <span>Condiciones de renovación</span>
          <textarea
            name="condiciones_renovacion"
            value={formulario.condiciones_renovacion}
            onChange={cambiarCampo}
            rows="3"
          />
        </label>

        <label className="form-alta__campo">
          <span>Marco legal</span>
          <input
            name="marco_legal"
            value={formulario.marco_legal}
            onChange={cambiarCampo}
          />
        </label>

        <label className="form-alta__campo">
          <span>Resolución</span>
          <input
            name="resolucion"
            value={formulario.resolucion}
            onChange={cambiarCampo}
          />
        </label>

        <label className="form-alta__campo">
          <span>Expediente o referencia</span>
          <input
            name="expediente"
            value={formulario.expediente}
            onChange={cambiarCampo}
          />
        </label>

        <label className="form-alta__campo">
          <span>Notas</span>
          <textarea
            name="notas"
            value={formulario.notas}
            onChange={cambiarCampo}
            rows="3"
          />
        </label>

        <div className="form-alta__campos-dobles">
          <label className="form-alta__campo">
            <span>Fecha de inicio</span>
            <input
              type="date"
              name="fecha_inicio"
              value={formulario.fecha_inicio}
              onChange={cambiarCampo}
            />
          </label>

          <label className="form-alta__campo">
            <span>Fecha de firma</span>
            <input
              type="date"
              name="fecha_firma"
              value={formulario.fecha_firma}
              onChange={cambiarCampo}
            />
          </label>

          <label className="form-alta__campo">
            <span>Fecha de vencimiento</span>
            <input
              type="date"
              name="fecha_vencimiento"
              value={formulario.fecha_vencimiento}
              onChange={cambiarCampo}
            />
          </label>

          <label className="form-alta__campo">
            <span>Días de preaviso</span>
            <input
              type="number"
              min="0"
              name="dias_preaviso"
              value={formulario.dias_preaviso}
              onChange={cambiarCampo}
            />
          </label>
        </div>

        <label className="form-alta__campo">
          <input
            type="checkbox"
            name="confidencialidad"
            checked={formulario.confidencialidad}
            onChange={cambiarCampo}
          />
          Información confidencial
        </label>

        {error && <p role="alert">{error}</p>}

        <div className="ficha__cambio-estado__acciones">
          <button type="button" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar ficha"}
          </button>
        </div>
      </form>
    </VentanaModal>
  );
}
