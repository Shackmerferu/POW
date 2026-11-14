import "./convenios.css";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logoFacultad from "../../cosas/imagenes/logo.png";
import flechalabel from "../../cosas/imagenes/flecha label.png";
import menu from "../../cosas/imagenes/list.svg";
import { API_URL } from "../config/config";
import {
  puedeVerConfiguracion,
  puedeVerConvenios,
  puedeVerPanel,
  rutaInicioPorRol,
} from "../../utils/permisos";
import { limpiarSesion, obtenerUsuario } from "../../utils/sesion";
import TablaConvenios from "../../componentes/tabladeconvenios";
import { ETIQUETAS_TIPO } from "../../utils/formatos";

const filters = [
  { id: "nombre", label: "Nombre", placeholder: "Convenio Facultad" },
  { id: "numero", label: "Número", placeholder: "103  " },
  { id: "anio", label: "Año", placeholder: "2024" },
  { id: "tipo", label: "Tipo", placeholder: "Convenio" },
  { id: "tipo de busqueda", label: "Tipo de Busqueda", placeholder: "" },
];

const options = [
  "Coincidir con alguna palabra.",
  "Coincidir con palabra completa.",
  "Coincidir con todas las palabras.",
];

function normalizarTexto(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function tituloCumple(titulo, texto, modo) {
  const objetivo = normalizarTexto(titulo);
  const consulta = normalizarTexto(texto);
  if (!consulta) return true;

  if (modo === options[1]) {
    const escapado = consulta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escapado}\\b`).test(objetivo);
  }

  const palabras = consulta.split(/\s+/).filter(Boolean);
  if (modo === options[2]) {
    return palabras.every((palabra) => objetivo.includes(palabra));
  }
  return palabras.some((palabra) => objetivo.includes(palabra));
}

/** El año del filtro debe coincidir con el año de firma (o creación). */
function anioCumple(convenio, anio) {
  const anioConvenio = String(
    convenio.fecha_firma || convenio.fecha_creacion || "",
  ).slice(0, 4);
  return anioConvenio === anio;
}

/** El tipo admite la clave de la base ("marco_pasantia") o su etiqueta ("Pasantía..."). */
function tipoCumple(convenio, texto) {
  const valor = normalizarTexto(texto);
  if (!valor) return true;
  const clave = normalizarTexto(convenio.tipo);
  const etiqueta = normalizarTexto(ETIQUETAS_TIPO[convenio.tipo] ?? "");
  return clave.includes(valor) || etiqueta.includes(valor);
}

export default function App() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  // Catálogo de unidades para resolver la columna "Unidad" de la tabla.
  const [unidades, setUnidades] = useState([]);
  // Todo el catálogo traído de la API (sirve de respaldo para las fichas).
  const [catalogo, setCatalogo] = useState([]);
  // null = todavía no se buscó; [] = se buscó y no hubo coincidencias.
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  function handleLogout() {
    limpiarSesion();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = obtenerUsuario();

    if (storedUser) {
      setUsuario(storedUser);
    }

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        // Solo cerramos sesión si el backend rechaza el token explícitamente.
        // Un 404/500 o un error de red no deben borrar una sesión válida.
        if (res.status === 401 || res.status === 403) {
          limpiarSesion();
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        console.warn(
          "No se pudo verificar la sesión: la API no está disponible",
        );
      });
  }, [navigate]);

  // Cargamos las unidades académicas una sola vez: la tabla las usa
  // para mostrar el nombre en lugar del id de la unidad responsable.
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/units`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.json())
      .then((respuesta) =>
        setUnidades(Array.isArray(respuesta?.data) ? respuesta.data : []),
      )
      .catch(() => setUnidades([]));
  }, []);

  // Consulta dinámica: al enviar el formulario pedimos los convenios
  // a la API y filtramos según el formulario de búsqueda.
  async function handleSubmit(event) {
    event.preventDefault();

    const datos = new FormData(event.target);
    const filtros = {
      nombre: datos.get("nombre")?.toString() ?? "",
      numero: datos.get("numero")?.toString() ?? "",
      anio: datos.get("anio")?.toString() ?? "",
      tipo: datos.get("tipo")?.toString() ?? "",
      modo: datos.get("opciones")?.toString() ?? options[0],
    };

    setBuscando(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/agreements`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        throw new Error(`La API respondió con estado ${res.status}`);
      }

      const respuesta = await res.json();
      const convenios = Array.isArray(respuesta?.data) ? respuesta.data : [];
      setCatalogo(convenios);

      const numero = normalizarTexto(filtros.numero);
      const anio = filtros.anio.trim();
      const tipo = normalizarTexto(filtros.tipo);

      const filtrados = convenios.filter((convenio) => {
        if (numero && !normalizarTexto(convenio.codigo_unico).includes(numero)) {
          return false;
        }
        if (anio && !anioCumple(convenio, anio)) {
          return false;
        }
        if (!tipoCumple(convenio, tipo)) {
          return false;
        }
        return tituloCumple(convenio.titulo, filtros.nombre, filtros.modo);
      });

      setResultados(filtrados);
    } catch (motivo) {
      console.warn("No se pudieron traer los convenios:", motivo);
      setError("No se pudo conectar con la API para traer los convenios.");
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }

  if (usuario && !puedeVerConvenios(usuario)) {
    return <Navigate to={rutaInicioPorRol(usuario)} replace />;
  }

  return (
    <main className="app-shell">
      <header className="top-navigation">
        <div className="brand">
          <img
            className="brand__logo"
            src={logoFacultad}
            alt="Facultad de Ingeniería"
          />
          <p className="brand__title">SISTEMA CONVENIOS</p>

          <nav className="navigation" aria-label="Navegación principal">
            <div className="dropdown flex-direction-row ">
              <button
                className="btn dropdown-toggle m-auto"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={menu}
                  className="pe-2"
                  alt="Flecha indicativa Label"
                />{" "}
                Menu
              </button>
              <ul className="dropdown-menu">
                <li>
                  <h6 className="dropdown-header">Menu</h6>
                </li>
                <li>
                  <a className="dropdown-item" href="/convenios">
                    Busqueda
                  </a>
                </li>
                {puedeVerPanel(usuario) && (
                  <li>
                    <a className="dropdown-item" href="/dashboard">
                      Panel Administrativo
                    </a>
                  </li>
                )}
                {puedeVerConfiguracion(usuario) && (
                  <li>
                    <a className="dropdown-item" href="/config">
                      Configuración
                    </a>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item logout-button"
                    type="button"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <section className="search-section" id="inicio">
        <div className="search-header">
          <h1>Buscar convenios</h1>
          <p>
            Filtra por nombre, número, año y tipo para encontrar convenios
            rápidamente.
          </p>
        </div>

        <div className="search-layout">
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="fields">
              {filters.map((filter) => {
                if (filter.id !== "tipo de busqueda") {
                  return (
                    <label className="field" key={filter.id}>
                      <span className="name-label">{filter.label}</span>
                      <input
                        id={filter.id}
                        name={filter.id}
                        type="text"
                        placeholder={filter.placeholder}
                        className="form-control"
                        inputMode={
                          filter.id === "anio" || filter.id === "numero"
                            ? "numeric"
                            : undefined
                        }
                        maxLength={
                          filter.id === "anio"
                            ? 4
                            : filter.id === "numero"
                              ? 10
                              : undefined
                        }
                        pattern={
                          filter.id === "anio"
                            ? "[0-9]{4}"
                            : filter.id === "numero"
                              ? "[0-9]{1,10}"
                              : undefined
                        }
                        title={
                          filter.id === "anio"
                            ? "Ingresá el año con 4 números"
                            : filter.id === "numero"
                              ? "Ingresá hasta 10 dígitos para el número de convenio"
                              : undefined
                        }
                        onChange={
                          filter.id === "anio" || filter.id === "numero"
                            ? (event) => {
                                const limite = filter.id === "anio" ? 4 : 10;
                                event.target.value = event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, limite);
                              }
                            : undefined
                        }
                      />
                    </label>
                  );
                }

                return (
                  <div className="field" key={filter.id}>
                    <span className="name-label">{filter.label}</span>
                  </div>
                );
              })}
            </div>

            <fieldset className="options">
              <legend>Opciones de convenio</legend>

              {options.map((option) => (
                <label key={option}>
                  <span className="option-control">
                    <input
                      type="radio"
                      name="opciones"
                      value={option}
                      defaultChecked={option === options[0]}
                    />
                    <span className="option-control__mark" />
                  </span>
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>

            <button className="btn btn-primary" type="submit">
              Buscar
            </button>
          </form>

          <div className="results" aria-live="polite">
            <div className="vertical-line"></div>
            <div className="contenido-dinamico">
              {buscando ? (
                <p className="aviso-consulta">Consultando la API…</p>
              ) : error ? (
                <p className="aviso-consulta">{error}</p>
              ) : resultados === null ? (
                <div className="no-contenido">
                  <img src={flechalabel} alt="Flecha indicativa Label" />
                  <p>No hay resultados que mostrar, Intente nuevamente</p>
                </div>
              ) : (
                <TablaConvenios
                  convenios={resultados}
                  conveniosCatalogo={catalogo}
                  unidades={unidades}
                  mensajeVacio="No hay resultados que mostrar, intente nuevamente."
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
