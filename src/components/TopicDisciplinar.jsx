import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RecommendedTopics from "./RecommendedTopics";
import "../styles/TopicDisciplinar.css";

const TopicDisciplinar = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [topic, setTopic] = useState({
    title: location.state?.title || "",
    text: location.state?.text || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (location.state?.title && location.state?.text) return;

    setLoading(true);
    const fetchTopic = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/topics-disciplinary/topic/${topicId}`
        );
        if (!response.ok) throw new Error("No se pudo obtener el tema.");

        const data = await response.json();
        setTopic({ title: data.title, text: data.text });
      } catch (error) {
        console.error("❌ Error al obtener el tema:", error);
        setError("No se pudo cargar el tema.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]);

  const checkIfSaved = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${apiUrl}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener datos del usuario");

      const userData = await response.json();
      setIsSaved(userData.savedTopics.includes(topicId));
    } catch (err) {
      console.error("❌ Error al verificar temas guardados:", err);
    }
  };

  useEffect(() => {
    checkIfSaved();
  }, [topicId, showPopup]);

  const handleSaveTopic = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Debes iniciar sesión para guardar temas.");
        return;
      }

      const response = await fetch(`${apiUrl}/user/save-topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topicId }),
      });

      if (response.ok) {
        setPopupMessage("¡Tema guardado con éxito! Puedes verlo en tu perfil.");
        setShowPopup(true);
        await checkIfSaved();
      } else {
        const data = await response.json();
        setError(data.errors[0]);
      }
    } catch (err) {
      setError("Error al guardar el tema.");
    }
  };

  const handleRemoveTopic = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Debes iniciar sesión para eliminar temas.");
        return;
      }

      const response = await fetch(`${apiUrl}/user/remove-topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topicId }),
      });

      if (response.ok) {
        setPopupMessage("¡Tema eliminado! Ya no está en tu perfil.");
        setShowPopup(true);
        await checkIfSaved();
      } else {
        const data = await response.json();
        setError(data.errors[0]);
      }
    } catch (err) {
      setError("Error al eliminar el tema.");
    }
  };

  return (
    <div key={topicId} className="topic-container">
      <button
        className="save-topic-button"
        onClick={isSaved ? handleRemoveTopic : handleSaveTopic}
      >
        {isSaved ? "Eliminar Tema" : "Guardar Tema"}
      </button>

      {loading ? (
        <p>Cargando tema...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="title-container">
            <h1>{topic.title}</h1>
          </div>

          <div className="formatted-text">
            {topic.text.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Componente de recomendaciones */}
          <RecommendedTopics title={topic.title} />
        </>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowPopup(false)}>
              ❌
            </button>
            <h2>{popupMessage}</h2>
            <button
              className="popup-button"
              onClick={() => navigate("/profile")}
            >
              Ir al perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicDisciplinar;
