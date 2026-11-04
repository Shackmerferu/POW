import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import logo from "../../logo.png";

function Register() {
  const navigate = useNavigate();

  // 1. Estado inicial sin email, enfocado en legajo (VARCHAR de 4)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    legajo: "",
    password: "",
    id_unidad: "1", // 1: Facultad de Ingeniería, 2: Rectorado
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const legajoLimpio = formData.legajo.trim();

    // Validar campos obligatorios completos
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !legajoLimpio ||
      !formData.password
    ) {
      showErrorWithTimeout("Por favor, completa todos los campos requeridos.");
      return;
    }

    // VALIDACIÓN: Expresión regular para exigir exactamente 4 números (VARCHAR(4))
    const legajoRegex = /^\d{4}$/;
    if (!legajoRegex.test(legajoLimpio)) {
      showErrorWithTimeout("El legajo debe contener exactamente 4 números (ejemplo: 0012).");
      return;
    }

    setError("");

    // --- SIMULACIÓN DE BASE DE DATOS LOCAL (localStorage) ---
    const existingUsers = JSON.parse(localStorage.getItem("users_db")) || [
      {
        legajo: "0001",
        contrasena: "123456",
        nombre_completo: "Germán (Admin Global)",
        rol: "administracion",
        id_unidad: null,
      },
      {
        legajo: "1001",
        contrasena: "123456",
        nombre_completo: "Tony (Gestor Ingeniería)",
        rol: "gestion",
        id_unidad: 1,
      },
    ];

    // Validar unicidad del Legajo
    const userExists = existingUsers.some((u) => u.legajo === legajoLimpio);
    if (userExists) {
      showErrorWithTimeout("El Legajo ingresado ya se encuentra registrado.");
      return;
    }

    // Estructura lista para MySQL
    const newUser = {
      legajo: legajoLimpio, // Guarda la cadena conservando ceros ("0012")
      contrasena: formData.password,
      nombre_completo: `${formData.firstName} ${formData.lastName}`.trim(),
      rol: "consulta", // Rol por defecto (lectura/descarga)
      id_unidad: parseInt(formData.id_unidad),
      activo: 1,
      id: Date.now(),
    };

    existingUsers.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(existingUsers));

    setSuccess("¡Cuenta creada con éxito! Se asignó el rol de consulta. Redirigiendo al login...");

    setTimeout(() => {
      navigate("/login");
    }, 2500);
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
          {/* Fila: Nombre y Apellido */}
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

          {/* Fila: Legajo y Contraseña */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="legajo">Legajo (4 números)</label>
              <input
                type="text"
                id="legajo"
                name="legajo"
                maxLength={4}
                inputMode="numeric"
                value={formData.legajo}
                onChange={(e) => {
                  // Filtra en tiempo real para dejar solo caracteres numéricos
                  const soloNumeros = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, legajo: soloNumeros });
                }}
                placeholder="0012"
              />
            </div>

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

          <button type="submit" className="btn-primary">
            Crear Cuenta
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