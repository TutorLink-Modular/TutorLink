import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CardTutorials from "./CardTutorials";
import image from "../assets/images/disciplinar.png";
import "../styles/TopicsByMainTopic.css";

const TopicsByMainTopic = () => {
  const { idMainTopic } = useParams();
  const [topics, setTopics] = useState([]);
  const [mainTopicInfo, setMainTopicInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, infoRes] = await Promise.all([
          fetch(`${apiUrl}/topics-disciplinary/main-topic/${idMainTopic}`),
          fetch(
            `${apiUrl}/topics-disciplinary/main-topics-disciplinary/${idMainTopic}`
          ),
        ]);

        if (!topicsRes.ok || !infoRes.ok)
          throw new Error("Error al obtener datos del tema principal.");

        const topicsData = await topicsRes.json();
        const infoData = await infoRes.json();

        setTopics(topicsData);
        setMainTopicInfo(infoData);
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

      {error && <p className="error-message">{error}</p>}

      <div className="cards-wrapper">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <CardTutorials
              key={topic._id}
              title={topic.title || "Sin título"}
              description={topic.description || "Sin descripción"}
              imageUrl={topic.image}
              defaultImage={image}
              onClick={() => handleCardClick(topic._id)}
            />
          ))
        ) : (
          <p>No hay temas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default TopicsByMainTopic;
