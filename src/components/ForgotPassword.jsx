import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para la navegación
import "../styles/ForgotPassword.css"; // Archivo CSS específico para ForgotPassword

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook de navegación

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Se ha enviado un enlace de recuperación a tu correo.");
      } else {
        const errorData = await response.json();
        setError(errorData.errors[0] || "No se pudo procesar tu solicitud.");
      }
    } catch (err) {
      setError("Hubo un problema con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Recuperar contraseña</h1>
        <p className="forgot-password-instruction">
          Ingresa tu correo electrónico para recibir un enlace de recuperación:
        </p>
        <form className="forgot-password-form" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`forgot-password-input ${error ? "error" : ""}`}
          />
          <button
            type="submit"
            className="forgot-password-button"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
        {error && <p className="forgot-password-error">{error}</p>}
        {message && <p className="forgot-password-success">{message}</p>}

        {/* Botón para regresar al login */}
        <button
          className="forgot-password-back-button"
          onClick={() => navigate("/login")}
        >
          Regresar al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
