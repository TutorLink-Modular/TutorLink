import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Para generar un UUID4
import "../styles/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !surname || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(alumnos\.udg\.mx|academicos\.udg\.mx)$/;
    if (!emailRegex.test(email)) {
      setError(
        "El correo electrónico debe ser de la institución @alumnos.udg.mx o @academicos.udg.mx"
      );
      return;
    }

    setIsLoading(true);

    try {
      const newUserId = uuidv4();

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: newUserId,
          name,
          surname,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Mostrar popup en lugar de redirigir inmediatamente
        setShowPopup(true);
      } else {
        const errorData = await response.json();
        setError(errorData.errors[0] || "Error al registrar el usuario");
      }
    } catch (err) {
      setError("Hubo un problema con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setError(null);
  };

  return (
    <div className="login-container">
      {isLoading && <div className="overlay"></div>}

      <div className="login-box">
        <h1 className="login-title">TutorLink</h1>
        <h2 className="login-welcome">Regístrate</h2>
        <p className="login-instruction">Crea tu cuenta para continuar:</p>
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            className={`login-input ${error ? "error" : ""}`}
            value={name}
            onChange={(e) => handleInputChange(e, setName)}
          />
          <input
            type="text"
            placeholder="Apellido"
            className={`login-input ${error ? "error" : ""}`}
            value={surname}
            onChange={(e) => handleInputChange(e, setSurname)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className={`login-input ${error ? "error" : ""}`}
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className={`login-input ${error ? "error" : ""}`}
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleShowPassword}
            >
              <i
                className={`fas ${
                  showPassword
                    ? "fa-eye eye-icon"
                    : "fa-eye-slash eyeSlash-icon"
                }`}
              ></i>
            </button>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              className={`login-input ${error ? "error" : ""}`}
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleShowConfirmPassword}
            >
              <i
                className={`fas ${
                  showConfirmPassword
                    ? "fa-eye eye-icon"
                    : "fa-eye-slash eyeSlash-icon"
                }`}
              ></i>
            </button>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Registrarse"}
          </button>
        </form>

        {isLoading && (
          <div className="spinner">
            <div className="circle"></div>
          </div>
        )}

        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="privacy-policy">
            Inicia sesión
          </a>
        </p>
      </div>

      {/* Popup de éxito */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>¡Registro exitoso!</h2>
            <p>
              Para completar tu registro, revisa tu correo electrónico y sigue
              el enlace de validación enviado.
            </p>
            <button
              className="popup-button"
              onClick={() => {
                setShowPopup(false);
                navigate("/login");
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
