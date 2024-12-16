import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState(""); // Campo para el correo electrónico
  const [password, setPassword] = useState(""); // Campo para la contraseña
  const [error, setError] = useState(null); // Mensaje de error en caso de fallos
  const navigate = useNavigate(); // Para redirigir a otras rutas

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Usar la URL base de la API desde las variables de entorno
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      console.log("Usando API URL:", apiUrl);

      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Enviar las credenciales
      });

      if (response.ok) {
        // Si la respuesta es exitosa, guardar el token y redirigir
        const data = await response.json();
        localStorage.setItem("authToken", data.jwt); // Guardar el token JWT en localStorage
        navigate("/"); // Redirigir a la página principal
      } else {
        // Manejar errores del servidor
        const errorData = await response.json();
        setError(errorData.errors[0] || "Error al iniciar sesión");
      }
    } catch (err) {
      // Manejar errores de red (por ejemplo, el servidor está caído)
      setError("Hubo un problema con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">TutorLink</h1>
        <p className="login-version">v0.1.1</p>
        <h2 className="login-welcome">Bienvenido</h2>
        <p className="login-instruction">Ingresa con tus credenciales:</p>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
        {/* Mostrar error en caso de que exista */}
        {error && <p className="login-error">{error}</p>}
        <p className="login-footer">
          Al iniciar sesión con tu correo y contraseña, aceptas nuestra{" "}
          <a href="#" className="privacy-policy">
            política de uso y privacidad.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
