import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import logo from "../../logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    legajo: "",
    password: "",
    id_unidad: "1", 
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const showErrorWithTimeout = (message) => {
    setError(message);
    setSuccess("");
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dniLimpio = formData.dni.trim();
    const legajoLimpio = formData.legajo.trim();

    
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !dniLimpio ||
      !legajoLimpio ||
      !formData.password
    ) {
      showErrorWithTimeout("Por favor, completa todos los campos requeridos.");
      return;
    }

    const dniRegex = /^\d{7,8}$/;
    if (!dniRegex.test(dniLimpio)) {
      showErrorWithTimeout("El DNI debe contener 7 u 8 números.");
      return;
    }

    
    const legajoRegex = /^\d{4}$/;
    if (!legajoRegex.test(legajoLimpio)) {
      showErrorWithTimeout("El legajo debe contener exactamente 4 números (ejemplo: 0012).");
      return;
    }

    setLoading(true);

    try {
      
      const nombreCompleto = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

     
      const response = await fetch("http://localhost:8000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: dniLimpio,
          legajo: legajoLimpio,
          contrasena: formData.password,
          nombre_completo: nombreCompleto, // Envia el string concatenado
          id_unidad: parseInt(formData.id_unidad),
        }),
      });

      const data = await response.json();

      if (response.ok && (data.status === 201 || data.status === 200)) {
        setError("");
        setSuccess("¡Cuenta creada con éxito en la base de datos! Redirigiendo al login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showErrorWithTimeout(data.mensaje || "El DNI o legajo ingresado ya se encuentra registrado.");
      }
    } catch (err) {
      console.error("Error al conectar con la API:", err);
      showErrorWithTimeout("No se pudo conectar con el servidor backend (puerto 8000).");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img src={logo} alt="Logo institucional" className="register-logo" />
          <div className="register-header-text">
            <h2>Registro de Usuario</h2>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Fila 1: Nombre y Apellido */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ej. Antonio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej. Funes"
              />
            </div>
          </div>

          {/* Fila 2: DNI y Legajo */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                maxLength={8}
                inputMode="numeric"
                value={formData.dni}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, dni: soloNumeros });
                }}
                placeholder="Ej. 40123456"
              />
            </div>

            <div className="form-group">
              <label htmlFor="legajo">Legajo</label>
              <input
                type="text"
                id="legajo"
                name="legajo"
                value={formData.legajo}
                onChange={handleChange}
                placeholder="Ej. 0012"
              />
            </div>
          </div>

          {/* Fila 3: Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {/* Selección por Radio Buttons */}
          <div className="form-group">
            <label className="radio-group-title">Seleccione la Unidad Académica:</label>
            <div className="radio-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="id_unidad"
                  value="1"
                  checked={formData.id_unidad === "1"}
                  onChange={handleChange}
                />
                <span>Facultad de Ingeniería</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="id_unidad"
                  value="2"
                  checked={formData.id_unidad === "2"}
                  onChange={handleChange}
                />
                <span>Rectorado</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="redirect-text">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;