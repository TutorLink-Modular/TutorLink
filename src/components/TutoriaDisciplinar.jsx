import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import CardTutorials from "./CardTutorials";
import image from "../assets/images/disciplinar.png";
import "../styles/TutoriaDisciplinar.css";

const TutoriaDisciplinar = () => {
  const [topics, setTopics] = useState([]); // Estado para almacenar los datos
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate(); // Hook para navegación
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Nos conectamos a nuestra API

  useEffect(() => {
    const fetchTopicsDisciplinar = async () => {
      try {
        //Hacemos nuestro GET para obtener la informacion de la BD
        const response = await fetch(`${apiUrl}/topics-disciplinary/topicsDisciplinaryCards`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        //Creamos nuestra variable con los datos obtenidos de la consulta de la base de datos
        const data = await response.json();
        setTopics(data); // Guardar los datos en el estado
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("No se pudo obtener la información de la tutoría.");
      }
    };

    fetchTopicsDisciplinar();
  }, []);

  // Redirige a OtherPage con texto y titulo
  const handleCardClick = async (topicId) => {
    // Volvemos a hacer otra consulta, ahora solo del texto y titulo del tema que el usuario selecciono
    try {
      const response = await fetch(`${apiUrl}/topics-disciplinary/topic/${topicId}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      //Creamos la variable con el resultado
      const topicData = await response.json();

      // Redirigir y pasar los datos directamente a OtherPage.jsx
      navigate(`/tutoria-disciplinar/topic/${topicId}`, { state: { title: topicData.title, text: topicData.text } });

    } catch (error) {
      console.error("Error al obtener el tema:", error);
      alert("No se pudo cargar el tema.");
    }
  };

  return (
    <div>
      <div className="titleDisciplinar-container">
        <h1 className="titleDisciplinar">Tutoría disciplinar</h1>
        <h3 className="descriptionDisciplinar">
            Explora temas disciplinares diseñados para tu crecimiento personal y académico.
        </h3>
      </div>
      <div className="cardDisciplinar-container">
      {error && <p className="error-message">{error}</p>}

      {topics.length > 0 ? (
        topics.map((topic, index) => (
          <CardTutorials
            key={topic._id}
            title={topic.title || "Sin título"} // Evita valores vacíos
            description={topic.description || "Sin descripción"}
            imageUrl={topic.image} // Usa imagen de BD 
            defaultImage={image} // o una por defecto
            onClick={() => handleCardClick(topic._id)}
          />
        ))
      ) : (
        !error && <p>Cargando temas disciplinares...</p>
      )}
      </div>
    </div>
  );
};

export default TutoriaDisciplinar;
