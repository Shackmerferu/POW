import { useEffect, useState } from "react";
import VentanaModal from "../VentanaModal/VentanaModal";
import "./EditarFichaConvenio.css";

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
      <form className="form-alta editar-ficha" onSubmit={enviar}>
        <p className="form-alta__nota">
          Actualizá los datos del convenio. Los campos con * son obligatorios.
        </p>

        <div className="editar-ficha__seccion">
          <h3>Datos del convenio</h3>
          <div className="form-alta__campo">
            <label className="form-label" htmlFor="editar-titulo">Título *</label>
            <input
              id="editar-titulo"
              className="form-control"
              name="titulo"
              value={formulario.titulo}
              onChange={cambiarCampo}
              required
            />
          </div>

          <div className="form-alta__campo">
            <label className="form-label" htmlFor="editar-objeto">Objeto *</label>
            <textarea
              id="editar-objeto"
              className="form-control"
              name="objeto"
              value={formulario.objeto}
              onChange={cambiarCampo}
              rows="3"
              required
            />
          </div>

          <div className="form-alta__campo">
            <label className="form-label" htmlFor="editar-obligaciones">Obligaciones</label>
            <textarea
              id="editar-obligaciones"
              className="form-control"
              name="obligaciones"
              value={formulario.obligaciones}
              onChange={cambiarCampo}
              rows="3"
            />
          </div>

          <div className="form-alta__campos-dobles">
            <div className="form-alta__campo">
              <label className="form-label" htmlFor="editar-rescision">Condiciones de rescisión</label>
              <textarea
                id="editar-rescision"
                className="form-control"
                name="condiciones_rescision"
                value={formulario.condiciones_rescision}
                onChange={cambiarCampo}
                rows="3"
              />
            </div>
            <div className="form-alta__campo">
              <label className="form-label" htmlFor="editar-renovacion">Condiciones de renovación</label>
              <textarea
                id="editar-renovacion"
                className="form-control"
                name="condiciones_renovacion"
                value={formulario.condiciones_renovacion}
                onChange={cambiarCampo}
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="editar-ficha__seccion">
          <h3>Marco y referencias</h3>
          <div className="form-alta__campos-dobles">
            <div className="form-alta__campo">
              <label className="form-label" htmlFor="editar-marco">Marco legal</label>
              <input
                id="editar-marco"
                className="form-control"
                name="marco_legal"
                value={formulario.marco_legal}
                onChange={cambiarCampo}
              />
            </div>
            <div className="form-alta__campo">
              <label className="form-label" htmlFor="editar-resolucion">Resolución</label>
              <input
                id="editar-resolucion"
                className="form-control"
                name="resolucion"
                value={formulario.resolucion}
                onChange={cambiarCampo}
              />
            </div>
          </div>
          <div className="form-alta__campo">
            <label className="form-label" htmlFor="editar-expediente">Expediente o referencia</label>
            <input
              id="editar-expediente"
              className="form-control"
              name="expediente"
              value={formulario.expediente}
              onChange={cambiarCampo}
            />
          </div>
          <div className="form-alta__campo">
            <label className="form-label" htmlFor="editar-notas">Notas</label>
            <textarea
              id="editar-notas"
              className="form-control"
              name="notas"
              value={formulario.notas}
              onChange={cambiarCampo}
              rows="3"
            />
          </div>
        </div>

        <div className="editar-ficha__seccion">
          <h3>Fechas y vencimiento</h3>
          <div className="row g-3">
            <div className="col-md-6 form-alta__campo">
              <label className="form-label" htmlFor="editar-fecha-inicio">Fecha de inicio</label>
              <input
                id="editar-fecha-inicio"
                className="form-control"
                type="date"
                name="fecha_inicio"
                value={formulario.fecha_inicio}
                onChange={cambiarCampo}
              />
            </div>
            <div className="col-md-6 form-alta__campo">
              <label className="form-label" htmlFor="editar-fecha-firma">Fecha de firma</label>
              <input
                id="editar-fecha-firma"
                className="form-control"
                type="date"
                name="fecha_firma"
                value={formulario.fecha_firma}
                onChange={cambiarCampo}
              />
            </div>
            <div className="col-md-6 form-alta__campo">
              <label className="form-label" htmlFor="editar-fecha-vencimiento">Fecha de vencimiento</label>
              <input
                id="editar-fecha-vencimiento"
                className="form-control"
                type="date"
                name="fecha_vencimiento"
                value={formulario.fecha_vencimiento}
                onChange={cambiarCampo}
              />
            </div>
            <div className="col-md-6 form-alta__campo">
              <label className="form-label" htmlFor="editar-preaviso">Días de preaviso</label>
              <input
                id="editar-preaviso"
                className="form-control"
                type="number"
                min="0"
                name="dias_preaviso"
                value={formulario.dias_preaviso}
                onChange={cambiarCampo}
              />
            </div>
          </div>
        </div>

        <label className="form-check editar-ficha__confidencialidad">
          <input
            className="form-check-input"
            type="checkbox"
            name="confidencialidad"
            checked={formulario.confidencialidad}
            onChange={cambiarCampo}
          />
          <span className="form-check-label">Información confidencial</span>
        </label>

        {error && <div className="alert alert-danger py-2 mb-0" role="alert">{error}</div>}

        <div className="form-alta__acciones editar-ficha__acciones">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </VentanaModal>
  );
}
