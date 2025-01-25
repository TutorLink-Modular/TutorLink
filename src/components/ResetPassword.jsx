import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("El token de recuperación no es válido.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        setMessage("Tu contraseña ha sido restablecida exitosamente.");
        setTimeout(() => navigate("/login"), 3000); // Redirige al login tras 3 segundos
      } else {
        const errorData = await response.json();
        setError(
          errorData.errors[0] || "No se pudo restablecer la contraseña."
        );
      }
    } catch (err) {
      setError("Hubo un problema con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Restablecer contraseña"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
