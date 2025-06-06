import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CardTutorials from "./CardTutorials";
import image from "../assets/images/disciplinar.png";
import SearchBar from "./SearchBar";
import "../styles/TopicsByMainTopic.css";

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

const TopicsByMainTopic = () => {
  const { idMainTopic } = useParams();
  const [topics, setTopics] = useState([]);
  const [mainTopicInfo, setMainTopicInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, infoRes] = await Promise.all([
          fetch(`${apiUrl}/topics-disciplinary/main-topic/${idMainTopic}`),
          fetch(`${apiUrl}/topics-disciplinary/main-topics-disciplinary/${idMainTopic}`),
        ]);
    
        if (!infoRes.ok) throw new Error("Error al obtener información del tema principal.");
    
        const infoData = await infoRes.json();
        setMainTopicInfo(infoData);
    
        const topicsData = topicsRes.ok ? await topicsRes.json() : [];
        setTopics(Array.isArray(topicsData) ? topicsData : []);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudieron obtener los temas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idMainTopic]);

  const handleCardClick = async (topicId) => {
    try {
      const response = await fetch(
        `${apiUrl}/topics-disciplinary/topic/${topicId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const topicData = await response.json();

      navigate(`/tutoria-disciplinar/topic/${topicId}`, {
        state: { title: topicData.title, text: topicData.text },
      });
    } catch (error) {
      console.error("Error al obtener el tema:", error);
      alert("No se pudo cargar el tema.");
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="topics-main-container">
      <h1 className="topics-main-title">{mainTopicInfo?.title}</h1>
      <h3 className="topics-main-description">{mainTopicInfo?.description}</h3>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar tema por título..."
      />

      {error && <p className="error-message">{error}</p>}

      <div className="cards-wrapper">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <CardTutorials
              key={topic._id}
              title={topic.title || "Sin título"}
              description={topic.description || "Sin descripción"}
              imageUrl={getImageUrl(topic.image) || defaultImage}
              //defaultImage={image}
              onClick={() => handleCardClick(topic._id)}
            />
          ))
        ) : (
          <p>No hay temas que coincidan con tu búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default TopicsByMainTopic;
