import "./convenios.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoFacultad from "../../cosas/imagenes/logo.png";
import flechalabel from "../../cosas/imagenes/flecha label.png";
import persona from "../../cosas/imagenes/persona.png";

const API_URL = "http://localhost:3000/api";

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

  function limpiarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  function handleLogout() {
    limpiarSesion();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");

    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (e) {
        // Ignorar error de parseo
      }
    }

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
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

  return (
    <main className="app-shell">
      <header className="top-navigation">
        <div className="brand">
          <img
            className="brand__logo"
            src={logoFacultad}
            alt="Facultad de Ingeniería"
          />
          <p className="brand__title">SISTEMA CONVENIOS - UNLPAM </p>

          <nav className="navigation" aria-label="Navegación principal">

            <div class="dropdown flex-direction-row ">
               
              <button class="btn dropdown-toggle m-auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={persona} className="pe-2" alt="Flecha indicativa Label" /> Mi Perfil
              </button>
              <ul class="dropdown-menu" >
                <li><h6 class="dropdown-header">Menu</h6></li>
                <li><a class="dropdown-item" href="#">Configuracion</a></li>
                <li><a class="dropdown-item active" href="#">Panel Administrativo</a></li>
                <li><a class="dropdown-item" href="#">Enlace separado</a></li>
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