import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardTutorials from "./CardTutorials";
import imageDisciplinar from "../assets/images/disciplinar.png";
import imageOrientacional from "../assets/images/orientacion.png";
import "../styles/RecommendedTopics.css";

// 📁 Cargar todas las imágenes locales (.png)
const images = import.meta.glob("../assets/images/**/*.png", {
  eager: true,
  import: "default",
});

// 🔍 Función para obtener la URL correcta de imagen (local o externa)
const getImageUrl = (imageName) => {
  if (!imageName) return null;

  // Si es un enlace externo
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }

  // Buscar imagen local
  const match = Object.entries(images).find(([path]) =>
    path.endsWith(imageName)
  );
  return match ? match[1] : null;
};

const RecommendedTopics = ({ title }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_PYTHON_API_URL;
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

    // 🔁 Forzar recarga completa de la página
    window.location.href = route;
  };

  return (
    <div className="recommended-container">
      <h2>Temas recomendados relacionados con "{title}"</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="cards-recommended-wrapper">
        {recommendations.length > 0
          ? recommendations.map((topic, index) => {
              // 🔹 Obtener imagen (prioriza la del tema)
              const topicImage =
                getImageUrl(topic.image) ||
                (isDisciplinar ? imageDisciplinar : imageOrientacional);

              return (
                <CardTutorials
                  key={index}
                  title={topic.title}
                  description={topic.description}
                  imageUrl={topicImage}
                  onClick={() => handleEnter(topic._id)}
                />
              );
            })
          : !error && <p>Cargando recomendaciones...</p>}
      </div>
    </div>
  );
};

export default RecommendedTopics;
