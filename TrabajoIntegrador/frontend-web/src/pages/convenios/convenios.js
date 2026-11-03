import 'bootstrap/dist/css/bootstrap.min.css';
import "./convenios.css";
import logoFacultad from "../../cosas/imagenes/logo.png";
import flechalabel from "../../cosas/imagenes/flecha label.svg";
import iconopersona from "../../cosas/imagenes/persona.svg";
const assetPath = "../../src/cosas/imagenes"

const filters = [
  { id: "nombre", label: "Nombre", placeholder: "Convenio Facultad" },
  { id: "numero", label: "Número", placeholder: "103  " },
  { id: "anio", label: "Año", placeholder: "2024" },
  { id: "tipo", label: "Tipo", placeholder: "Convenio" },
]

const options = ["Opcion A", "Opcion B", "Opcion C", "Opcion D"]

export default function App() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <main className="app-shell">
      <header className="top-navigation">
        <div className="brand">
          <img className="brand__logo" src={logoFacultad} alt="Facultad de Ingeniería" />
          <p className="brand__title">Sistema de gestión de convenios</p>
          <span className="brand__pill">CONVENIOS</span>
        </div>

        <nav className="navigation" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#panel">Panel</a>
          <a className="profile" href="#perfil">
             <img src={iconopersona} alt="Flecha indicativa Label" />
            <span>Mi Perfil</span>
          </a>
        </nav>
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
              {filters.map((filter, index) => (
                <label className="field" key={filter.id}>
                  <span className={index === 0 ? "name-label" : undefined}>
                    {index === 0 && (
                      <img src={flechalabel} alt="Flecha indicativa Label" />
                    )}
                    {filter.label}
                  </span>
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

            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>

          <div className="results" aria-live="polite">
            <div className="vertical-line"></div>
            <div className="contenido-dinamico">
              <p>No hay resultados que mostrar, Intente nuevamente</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
