import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../logo.png";

function Login() {
  // 1. ESTADO DEL FORMULARIO (Legajo en lugar de email para coincidir con la DB)
  const [legajo, setLegajo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Función para cerrar automáticamente los mensajes de error a los 5 segundos
  const showErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  // 2. MANEJADOR DEL ENVÍO DEL FORMULARIO
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!legajo.trim() || !password) {
      showErrorWithTimeout("Por favor, ingresa tu usuario/legajo y contraseña.");
      return;
    }

    // --- SIMULACIÓN DE AUTENTICACIÓN CON LA DB LOCAL ---
    const usersDB = JSON.parse(localStorage.getItem("users_db")) || [
      // Usuarios por defecto coincidentes con el dump SQL de tu base de datos
      {
        legajo: "ADMIN-001",
        contrasena: "123456",
        nombre_completo: "Germán (Admin Global)",
        rol: "administracion",
        id_unidad: null,
      },
      {
        legajo: "GEST-001",
        contrasena: "123456",
        nombre_completo: "Tony (Gestor Ingeniería)",
        rol: "gestion",
        id_unidad: 1,
      },
    ];

    // Buscar si coinciden las credenciales (Legajo o Correo)
    const validUser = usersDB.find(
      (u) =>
        (u.legajo === legajo.trim() || u.email === legajo.toLowerCase().trim()) &&
        (u.contrasena === password || u.password === password)
    );

    if (validUser) {
      setError("");
      // Guardar la sesión activa del usuario
      localStorage.setItem("active_user", JSON.stringify(validUser));
      // Redirigir al Dashboard / Convenios
      navigate("/dashboard");
    } else {
      showErrorWithTimeout("Usuario/Legajo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo institucional" className="login-logo" />
        <h2>Sistema de Convenios UNLPam</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="legajo">Usuario / Legajo / Correo</label>
            <input
              type="text"
              id="legajo"
              value={legajo}
              onChange={(e) => setLegajo(e.target.value)}
              placeholder="Ej. GEST-001 o usuario@unlpam.edu.ar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
        </form>

        <p className="redirect-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;