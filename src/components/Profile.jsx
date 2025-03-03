import React, { useEffect, useState } from "react";
import "../styles/Profile.css"; // Archivo CSS para estilos
import "@fortawesome/fontawesome-free/css/all.min.css"; // Importar FontAwesome

const Profile = () => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const token = localStorage.getItem("authToken"); // Obtener el token del usuario

        if (!token) {
          setError("Usuario no autenticado.");
          return;
        }

        const response = await fetch(`${apiUrl}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await response.json();
        setUserData(data); // Guardar los datos en el estado
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-box">
        {/* Ícono de usuario en lugar de imagen */}
        <i className="fas fa-user-circle profile-icon"></i>

        {/* Mostrar datos del usuario si están disponibles */}
        {userData ? (
          <>
            <h1 className="profile-title">
              {userData.name} {userData.surname}
            </h1>
            <p className="profile-email">{userData.email}</p>
          </>
        ) : error ? (
          <p className="profile-error">{error}</p>
        ) : (
          <p className="profile-loading">Cargando datos...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
