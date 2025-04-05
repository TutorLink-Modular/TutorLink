import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Login = () => {
  const [email, setEmail] = useState(""); // Campo para el correo electrónico
  const [password, setPassword] = useState(""); // Campo para la contraseña
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [error, setError] = useState(null); // Mensaje de error en caso de fallos
  const [info, setInfo] = useState(null); // Mensaje informativo (por ejemplo, reenvío exitoso)
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar si está cargando
  const [showResendButton, setShowResendButton] = useState(false); // Estado para mostrar el botón de reenvío
  const navigate = useNavigate(); // Para redirigir a otras rutas

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.jwt);
        // Obtener solo name y surname del perfil
        const profileResponse = await fetch(`${apiUrl}/user/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${data.jwt}`,
            "Content-Type": "application/json"
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const { name, surname, _id } = profileData;
          localStorage.setItem("user", JSON.stringify({ name, surname, _id }));
        }

        // Establecer expiración en 30 minutos si se sale de la pagina
        const expiration = new Date().getTime() + 30 * 60 * 1000;
        localStorage.setItem("tokenExpiresAt", expiration);
        navigate("/");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.errors[0] || "Error al iniciar sesión";

        if (
          errorMessage ===
          "Por favor verifica tu correo electrónico antes de iniciar sesión."
        ) {
          setShowResendButton(true); // Mostrar botón de reenvío si el correo no está verificado
        }

        setError(errorMessage);
      }
    } catch (err) {
      setError("Hubo un problema con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError(
        "Por favor, ingresa tu correo electrónico para reenviar el código."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setInfo(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/user/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setInfo(
          "Se ha enviado un nuevo código de verificación. Revisa tu correo."
        );
      } else {
        const errorData = await response.json();
        setError(errorData.errors[0] || "No se pudo reenviar el código.");
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
    setInfo(null); // Limpiar mensajes informativos cuando el usuario edite
  };

  return (
    <div className="login-container">
      {isLoading && <div className="overlay"></div>}

      <div className="login-box">
        <h1 className="login-title">TutorLink</h1>
        <h2 className="login-welcome">Bienvenido</h2>
        <p className="login-instruction">Ingresa con tus credenciales:</p>
        <form className="login-form" onSubmit={handleLogin}>
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
              onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Mostrar mensajes informativos o de error */}
        {error && <p className="login-error">{error}</p>}
        {info && <p className="login-info">{info}</p>}

        {/* Mostrar botón de reenvío solo si el correo necesita validación */}
        {showResendButton && (
          <button
            className="resend-code-button"
            onClick={handleResendCode}
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Reenviar código de verificación"}
          </button>
        )}

        {/* Enlace para recuperación de contraseña */}
        <p
          className="forgot-password-link"
          onClick={() => navigate("/forgot-password")}
        >
          ¿Olvidaste tu contraseña?
        </p>

        <p className="login-footer">
          Al iniciar sesión con tu correo y contraseña, aceptas nuestra{" "}
          <a
            href="https://udg.mx/politica-de-privacidad-y-manejo-de-datos"
            className="privacy-policy"
          >
            política de uso y privacidad.
          </a>
        </p>

        <div className="register-link">
          <p>¿No tienes cuenta?</p>
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
