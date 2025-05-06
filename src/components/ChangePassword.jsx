import React, { useState } from "react";
import "../styles/ChangePassword.css";
import ModalMessage from "./ModalMessage";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", actions: [] });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setModal({
        show: true,
        title: "Campos requeridos",
        message: "Por favor completa todos los campos.",
        actions: [{ label: "Aceptar", onClick: () => setModal({ show: false }) }],
      });
    }

    if (newPassword !== confirmPassword) {
      return setModal({
        show: true,
        title: "Contraseñas no coinciden",
        message: "Verifica que ambas contraseñas sean iguales.",
        actions: [{ label: "Aceptar", onClick: () => setModal({ show: false }) }],
      });
    }

    setModal({
      show: true,
      title: "¿Estás seguro?",
      message: "¿Deseas cambiar tu contraseña?",
      type: "green",
      actions: [
        { label: "Cancelar", onClick: () => setModal({ show: false }) },
        {
          label: "Sí, cambiar",
          onClick: () => {
            setModal({ show: false });
            updatePassword();
          },
        },
      ],
    });
  };

  const updatePassword = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${apiUrl}/user/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.errors?.[0] || "Error al cambiar contraseña");
      }

      setModal({
        show: true,
        title: "Éxito",
        message: "Tu contraseña fue cambiada correctamente.",
        actions: [{ label: "Aceptar", onClick: () => setModal({ show: false }) }],
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: err.message || "No se pudo actualizar la contraseña.",
        actions: [{ label: "Cerrar", onClick: () => setModal({ show: false }) }],
      });
    }
  };

  return (
    <div className="change-password-container">
      <h2>Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="change-password-form">

        <label>
          Contraseña actual:
          <div className="password-container">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleShowOldPassword}
              aria-label="Mostrar/Ocultar contraseña actual"
            >
              <i className={`fas ${showOldPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
          </div>
        </label>

        <label>
          Nueva contraseña:
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleShowPassword}
              aria-label="Mostrar/Ocultar nueva contraseña"
            >
              <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
          </div>
        </label>

        <label>
          Confirmar contraseña:
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleShowConfirmPassword}
              aria-label="Mostrar/Ocultar confirmación"
            >
              <i className={`fas ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
          </div>
        </label>

        <button className="ActualizarContraseñaButton" type="submit">
          Actualizar contraseña
        </button>
      </form>

      <ModalMessage {...modal} onClose={() => setModal({ show: false })} />
    </div>
  );
};

export default ChangePassword;