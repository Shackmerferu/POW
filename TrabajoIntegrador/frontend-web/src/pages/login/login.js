import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../logo.png";

const API_URL = "http://localhost:3000/api";

function Login() {
  const [dni, setDni] = useState("");
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

    const dniLimpio = dni.trim();

    if (!dniLimpio || !password) {
      showErrorWithTimeout("Por favor, ingresa tu DNI y contraseña.");
      return;
    }

    if (!/^\d{7,8}$/.test(dniLimpio)) {
      showErrorWithTimeout("El DNI debe contener 7 u 8 dígitos numéricos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni: dniLimpio, contrasena: password }),
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
        <p className="login-subtitle">Ingrese sus credenciales institucionales</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              autoComplete="username"
              inputMode="numeric"
              maxLength={8}
              value={dni}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, "");
                setDni(soloNumeros);
              }}
              placeholder="Ingrese su número de DNI"
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
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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