import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import logo from "../../logo.png";

function Register() {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    unit: "Facultad de Ingeniería",
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

   
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      showErrorWithTimeout("Por favor, completa todos los campos requeridos.");
      return;
    }

   
    const emailLowerCase = formData.email.toLowerCase().trim();
    if (!emailLowerCase.endsWith("@unlpam.edu.ar")) {
      showErrorWithTimeout("El correo es invalido");
      return;
    }

 
    setError("");

   
    const existingUsers = JSON.parse(localStorage.getItem("users_db")) || [];

    
    const userExists = existingUsers.some((u) => u.email === emailLowerCase);
    if (userExists) {
      showErrorWithTimeout("El correo ya se encuentra registrado.");
      return;
    }

    
    const newUser = {
      ...formData,
      email: emailLowerCase,
      role: "visitante",
      id: Date.now(),
    };

    existingUsers.push(newUser);
    localStorage.setItem("users_db", JSON.stringify(existingUsers));

    setSuccess("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo"
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
                placeholder=""
              />
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