import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, ingresa tu usuario y contraseña.");
      return;
    }

    setError("");
    console.log("Enviando datos al servidor:", { email, password });
    alert("¡Inicio de sesión registrado!");
    navigate("/convenios");
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
