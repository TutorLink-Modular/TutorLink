import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Para generar un UUID4
import "../styles/Login.css";

const Register = () => {
  const [name, setName] = useState(""); // Campo para el nombre
  const [surname, setSurname] = useState(""); // Campo para el apellido
  const [email, setEmail] = useState(""); // Campo para el correo electrónico
  const [password, setPassword] = useState(""); // Campo para la contraseña
  const [error, setError] = useState(null); // Mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar si está cargando
  const navigate = useNavigate(); // Para redirigir a otras rutas

  // Función para manejar el registro
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!name || !surname || !email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true); // Activar el indicador de carga

    try {
      // Generar un nuevo UUID para el _id
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
        }), // Enviar los datos del nuevo usuario
      });

      if (response.ok) {
        // Si la respuesta es exitosa, redirigir al login
        navigate("/login");
      } else {
        // Manejar errores del servidor
        const errorData = await response.json();
        setError(errorData.errors[0] || "Error al registrar el usuario");
      }
    } catch (err) {
      // Manejar errores de red (por ejemplo, el servidor está caído)
      setError("Hubo un problema con el servidor.");
    } finally {
      setIsLoading(false); // Desactivar el indicador de carga
    }
  };

  // Función para manejar el cambio en los campos de entrada
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setError(null); // Limpiar el error cuando el usuario empieza a escribir
  };

  return (
    <div className="login-container">
      {/* Fondo opaco durante la carga */}
      {isLoading && <div className="overlay"></div>}

      <div className="login-box">
        <h1 className="login-title">TutorLink</h1>
        <p className="login-version">v0.1.1</p>
        <h2 className="login-welcome">Regístrate</h2>
        <p className="login-instruction">Crea tu cuenta para continuar:</p>
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            className={`login-input ${error ? "error" : ""}`} // Añadir clase 'error' si hay un error
            value={name}
            onChange={(e) => handleInputChange(e, setName)} // Limpiar error cuando cambia el nombre
          />
          <input
            type="text"
            placeholder="Apellido"
            className={`login-input ${error ? "error" : ""}`} // Añadir clase 'error' si hay un error
            value={surname}
            onChange={(e) => handleInputChange(e, setSurname)} // Limpiar error cuando cambia el apellido
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className={`login-input ${error ? "error" : ""}`} // Añadir clase 'error' si hay un error
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)} // Limpiar error cuando cambia el correo
          />
          <input
            type="password"
            placeholder="Contraseña"
            className={`login-input ${error ? "error" : ""}`} // Añadir clase 'error' si hay un error
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)} // Limpiar error cuando cambia la contraseña
          />
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Registrarse"}
          </button>
        </form>

        {/* Mostrar un spinner o mensaje mientras se carga */}
        {isLoading && (
          <div className="spinner">
            <div className="circle"></div>
          </div>
        )}

        {/* Mostrar error en caso de que exista */}
        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="privacy-policy">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
