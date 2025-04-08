import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; //Importamos `useNavigate`
import "../styles/Profile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disciplinarTopics, setDisciplinarTopics] = useState([]);
  const [orientationalTopics, setOrientationalTopics] = useState([]);
  const [isDisciplinarOpen, setIsDisciplinarOpen] = useState(false);
  const [isOrientationalOpen, setIsOrientationalOpen] = useState(false);
  const navigate = useNavigate(); //Para redirigir a los temas

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Usuario no autenticado.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);

        //Obtener los títulos de los temas guardados
        fetchTopicTitles(data.savedTopics, "disciplinar");
        fetchTopicTitles(data.savedOrientationalTopics, "orientacional");
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  //Función para obtener títulos desde la API según el tipo de tema
  const fetchTopicTitles = async (topicIds, type) => {
    try {
      if (!topicIds || topicIds.length === 0) return;

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const endpoint =
        type === "disciplinar"
          ? "/topics-disciplinary/topic/"
          : "/topics-orientation/topic/";

      const topics = await Promise.all(
        topicIds.map(async (id) => {
          const response = await fetch(`${apiUrl}${endpoint}${id}`);
          if (!response.ok) return { id, title: "Tema no encontrado" };

          const data = await response.json();
          return { id, title: data.title };
        })
      );

      if (type === "disciplinar") setDisciplinarTopics(topics);
      else setOrientationalTopics(topics);
    } catch (error) {
      console.error("❌ Error al obtener títulos de temas:", error);
    }
  };

  //función para redirigir a un tema guardado
  const navigateToTopic = (topicId, type) => {
    if (type === "disciplinar") {
      navigate(`/tutoria-disciplinar/topic/${topicId}`); //Corrige la ruta
    } else {
      navigate(`/tutoria-orientacional/topic/${topicId}`); //Corrige la ruta
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <i className="fas fa-user-circle profile-icon"></i>

        {loading ? (
          <p className="profile-loading">Cargando datos...</p>
        ) : error ? (
          <p className="profile-error">{error}</p>
        ) : (
          <>
            <h1 className="profile-title">
              {userData.name} {userData.surname}
            </h1>
            <p className="profile-email">{userData.email}</p>

            {/* dropdown de Tutoría Disciplinar */}
            <div className="dropdown">
              <button
                className="dropdown-button"
                onClick={() => setIsDisciplinarOpen(!isDisciplinarOpen)}
              >
                Tutoría Disciplinar
                <i
                  className={`fas ${
                    isDisciplinarOpen ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></i>
              </button>
              {isDisciplinarOpen && (
                <ul className="dropdown-content">
                  {disciplinarTopics.length > 0 ? (
                    disciplinarTopics.map((topic) => (
                      <li
                        key={topic.id}
                        className="clickable-topic" //Clase CSS para diseño
                        onClick={() => navigateToTopic(topic.id, "disciplinar")}
                      >
                        {topic.title}
                      </li>
                    ))
                  ) : (
                    <li>No hay temas guardados</li>
                  )}
                </ul>
              )}
            </div>

            {/*Dropdown de Tutoría de Orientación */}
            <div className="dropdown">
              <button
                className="dropdown-button"
                onClick={() => setIsOrientationalOpen(!isOrientationalOpen)}
              >
                Tutoría de Orientación
                <i
                  className={`fas ${
                    isOrientationalOpen ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></i>
              </button>
              {isOrientationalOpen && (
                <ul className="dropdown-content">
                  {orientationalTopics.length > 0 ? (
                    orientationalTopics.map((topic) => (
                      <li
                        key={topic.id}
                        className="clickable-topic" //Clase CSS para diseño
                        onClick={() =>
                          navigateToTopic(topic.id, "orientacional")
                        }
                      >
                        {topic.title}
                      </li>
                    ))
                  ) : (
                    <li>No hay temas guardados</li>
                  )}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
