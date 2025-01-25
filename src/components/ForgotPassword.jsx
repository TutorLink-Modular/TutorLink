import React, { useState } from "react";
import "../styles/ForgotPassword.css"; // Crea un archivo CSS si es necesario

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      <h2>Recuperar contraseña</h2>
      <p>
        Ingresa tu correo electrónico para recibir un enlace de recuperación:
      </p>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`forgot-password-input ${error ? "error" : ""}`}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
