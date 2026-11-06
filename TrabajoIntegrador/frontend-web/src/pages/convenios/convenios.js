import "./convenios.css";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logoFacultad from "../../cosas/imagenes/logo.png";
import flechalabel from "../../cosas/imagenes/flecha label.png";
import menu from "../../cosas/imagenes/list.svg"
import{ API_URL } from "../config/config"
import {
  puedeVerConfiguracion,
  puedeVerConvenios,
  puedeVerPanel,
  rutaInicioPorRol,
} from "../../utils/permisos";
import { limpiarSesion, obtenerUsuario } from "../../utils/sesion";



const filters = [
  { id: "nombre", label: "Nombre", placeholder: "Convenio Facultad" },
  { id: "numero", label: "Número", placeholder: "103  " },
  { id: "anio", label: "Año", placeholder: "2024" },
  { id: "tipo", label: "Tipo", placeholder: "Convenio" },
];

const options = ["Opcion A", "Opcion B", "Opcion C", "Opcion D"];

export default function App() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

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

  function handleSubmit(event) {
    event.preventDefault();
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
               
              <button className="btn dropdown-toggle m-auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={menu} className="pe-2" alt="Flecha indicativa Label" /> Menu
              </button>
              <ul className="dropdown-menu" >
                <li><h6 className="dropdown-header">Menu</h6></li>
                <li><a className="dropdown-item" href="/convenios">Busqueda</a></li>
                {puedeVerPanel(usuario) && (
                  <li><a className="dropdown-item" href="/dashboard">Panel Administrativo</a></li>
                )}
                {puedeVerConfiguracion(usuario) && (
                  <li><a className="dropdown-item" href="/config">Configuración</a></li>
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
        </div >
      </header >

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
              {filters.map((filter) => (
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
                      filter.id === "anio" ? 4 : filter.id === "numero" ? 10 : undefined
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
              ))}
            </div>

            <fieldset className="options">
              <legend>Opciones de convenio</legend>
              {options.map((option) => (
                <label key={option}>
                  <span className="option-control">
                    <input type="radio" name="opciones" value={option} />
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
              <div className="no-contenido">
                <img src={flechalabel} alt="Flecha indicativa Label" />
                <p>No hay resultados que mostrar, Intente nuevamente</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main >
  );
}