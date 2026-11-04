import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../logo.png";

const API_URL = "http://localhost:3000/api";

function Login() {
  const [legajo, setLegajo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const legajoLimpio = legajo.trim();

    if (!legajoLimpio || !password) {
      showErrorWithTimeout("Por favor, ingresa tu legajo y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ legajo: legajoLimpio, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok && (data.status === 200 || response.status === 200)) {
        setError("");
        localStorage.setItem("active_user", JSON.stringify(data.usuario));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/convenios");
      } else {
        showErrorWithTimeout(data.mensaje || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      showErrorWithTimeout("No se pudo conectar con el servidor backend.");
    } finally {
      setLoading(false);
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
            <label htmlFor="legajo">Legajo (4 números)</label>
            <input
              type="text"
              id="legajo"
              maxLength={4}
              inputMode="numeric"
              value={legajo}
              onChange={(e) => setLegajo(e.target.value.replace(/\D/g, ""))}
              placeholder="0012"
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
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