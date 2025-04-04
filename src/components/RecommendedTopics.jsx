import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardTutorials from "./CardTutorials";
import imageDisciplinar from "../assets/images/disciplinar.png";
import imageOrientacional from "../assets/images/orientacion.png";
import "../styles/RecommendedTopics.css";

const RecommendedTopics = ({ title }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = "http://localhost:5001";
  const apiUrlBack = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const location = useLocation();

  const isDisciplinar = location.pathname.includes("/tutoria-disciplinar");
  const category = isDisciplinar ? "disciplinar" : "orientacional";

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!title || title.trim() === "") return; // ⛔ Evita hacer fetch si no hay título

      try {
        const response = await fetch(
          `${apiUrl}/recommend?title=${encodeURIComponent(
            title
          )}&category=${category}`
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener recomendaciones.");
      }
    };

    fetchRecommendations();
  }, [title, category]);

  const handleEnter = (topicId) => {
    const route = isDisciplinar
      ? `/tutoria-disciplinar/topic/${topicId}`
      : `/tutoria-orientacional/topic/${topicId}`;

    // Forzar recarga completa de la página
    window.location.href = route;
  };

  return (
    <div className="recommended-container">
      <h2>Temas recomendados relacionados con "{title}"</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="cards-recommended-wrapper">
        {recommendations.length > 0
          ? recommendations.map((topic, index) => (
              <CardTutorials
                key={index}
                title={topic.title}
                description={topic.description}
                imageUrl={isDisciplinar ? imageDisciplinar : imageOrientacional}
                onClick={() => handleEnter(topic._id)}
              />
            ))
          : !error && <p>Cargando recomendaciones...</p>}
      </div>
    </div>
  );
};

export default RecommendedTopics;
