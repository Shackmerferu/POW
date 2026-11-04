import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../logo.png";

const API_URL = "http://localhost:3000/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, ingresa tu usuario y contraseña.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legajo: email, contrasena: password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Guardamos la sesión en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        navigate("/convenios");
      } else {
        setError(data.mensaje || "Credenciales incorrectas.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setCargando(false);
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
            <label htmlFor="email">Usuario/Legajo</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toni122"
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

          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? "Iniciando..." : "Iniciar Sesión"}
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
