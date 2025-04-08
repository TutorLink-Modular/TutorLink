import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardTutorials from "./CardTutorials";
import HeaderDisciplinar from "./HeaderTopic";
import imageHeader from "../assets/images/HeaderDisciplinar.png";
import "../styles/TutoriaDisciplinar.css";


const TutoriaDisciplinar = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Cargar todas las imágenes de la carpeta disciplinar
  const images = import.meta.glob('../assets/images/**/*.png', {
    eager: true,
    import: 'default',
  });

  // Buscar la imagen que coincida con el nombre guardado
  const getImageUrl = (imageName) => {
    const match = Object.entries(images).find(([path]) =>
      path.endsWith(imageName)
    );
    return match ? match[1] : null;
  };

  const defaultImage = "../assets/images/disciplinar.png"; // Ruta de la imagen por defecto

  useEffect(() => {
    const fetchMainTopicsDisciplinar = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/topics-disciplinary/main-topics-disciplinary`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("No se pudo obtener la información de la tutoría.");
      }
    };

    fetchMainTopicsDisciplinar();
  }, []);

  const handleCardClick = async (topicId) => {
    try {
      const response = await fetch(
        `${apiUrl}/topics-disciplinary/main-topic/${topicId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const topicData = await response.json();

      navigate(`/tutoria-disciplinar/main-topic/${topicId}`, {
        state: { title: topicData.title },
      });
    } catch (error) {
      console.error("Error al obtener el tema:", error);
      alert("No se pudo cargar el tema.");
    }
  };

  return (
    <div>
      <HeaderDisciplinar
        title="Tutoría Disciplinar"
        subtitle="Explora una variedad de temas disciplinares cuidadosamente diseñados para impulsar tu crecimiento personal y académico. A través de recursos especializados y enfoques innovadores, amplía tus conocimientos, desarrolla nuevas habilidades y fortalece tu formación en distintas áreas del saber."
        imageSrc={imageHeader}
      />

      <div className="cardDisciplinar-container">
        {error && <p className="error-message">{error}</p>}

        {topics.length > 0
          ? topics.map((topic, index) => (
              <CardTutorials
                key={topic._id}
                title={topic.title || "Sin título"}
                description={topic.description || "Sin descripción"}
                imageUrl={getImageUrl(topic.image) || defaultImage}
                onClick={() => handleCardClick(topic._id)}
              />
            ))
          : !error && <p>Cargando temas disciplinares...</p>}
      </div>
    </div>
  );
};

export default TutoriaDisciplinar;
