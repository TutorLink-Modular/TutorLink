import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardTutorials from "./CardTutorials";
import image from "../assets/images/orientacion.png";
import imageHeader from "../assets/images/HeaderOrientacional.png";
import "../styles/TutoriaOrientacional.css";
import HeaderOrientacional from "./HeaderTopic";

const TutoriaOrientacion = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchTopicsOrientation = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/topics-orientation/topicsOrientationCards`,
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

    fetchTopicsOrientation();
  }, []);

  const handleCardClick = async (topicId) => {
    try {
      const response = await fetch(
        `${apiUrl}/topics-orientation/topic/${topicId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const topicData = await response.json();

      navigate(`/tutoria-orientacional/topic/${topicId}`, {
        state: { title: topicData.title, text: topicData.text },
      });
    } catch (error) {
      console.error("Error al obtener el tema:", error);
      alert("No se pudo cargar el tema.");
    }
  };

  return (
    <div>
      <HeaderOrientacional
        title="Tutoría De Orientacíon"
        subtitle="En la tutoría de orientación encontrarás acompañamiento en la toma de decisiones, desarrollo emocional, habilidades sociales y estrategias para construir tu proyecto de vida. Aquí te guiamos para que enfrentes tus retos con seguridad y confianza."
        imageSrc={imageHeader}
      />
      <div className="cardOrientacional-container">
        {error && <p className="error-message">{error}</p>}

        {topics.length > 0
          ? topics.map((topic, index) => (
              <CardTutorials
                key={topic._id}
                title={topic.title || "Sin título"}
                description={topic.description || "Sin descripción"}
                imageUrl={topic.image}
                defaultImage={image}
                onClick={() => handleCardClick(topic._id)}
              />
            ))
          : !error && <p>Cargando temas de orientación...</p>}
      </div>
    </div>
  );
};

export default TutoriaOrientacion;
