import React from "react";
import "../styles/Login.css"; // Importar estilos

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">TutorLink</h1>
        <p className="login-version">v0.1.1</p>
        <h2 className="login-welcome">Bienvenido</h2>
        <p className="login-instruction">Ingresa con tus credenciales:</p>
        <form className="login-form">
          <input type="text" placeholder="Código" className="login-input" />
          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
          />
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
        <p className="login-footer">
          Al iniciar sesión con tu código y NIP para consultar tu información
          académica aceptas nuestra{" "}
          <a href="#" className="privacy-policy">
            política de uso y privacidad.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
