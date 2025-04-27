// TopicOrientacional.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RecommendedTopics from "./RecommendedTopics";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import "../styles/TopicOrientacional.css";

const toEmbedURL = (url) => {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname.includes("youtube.com") &&
      urlObj.searchParams.get("v")
    ) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
    }
    if (urlObj.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${urlObj.pathname}`;
    }
    return url;
  } catch (e) {
    return url;
  }
};

const TopicOrientacional = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [topic, setTopic] = useState({
    _id: uuidv4(),
    title: location.state?.title || "",
    text: location.state?.text || "",
    videos: location.state?.videos || [],
    comments: location.state?.comments || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (
      location.state?.title &&
      location.state?.text &&
      location.state?.videos &&
      location.state?.comments
    )
      return;
    setLoading(true);
    fetch(`${apiUrl}/topics-orientation/topic/${topicId}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("No se pudo obtener el tema.")
      )
      .then((data) => {
        setTopic({
          _id: data._id,
          title: data.title,
          text: data.text,
          videos: data.videos || [],
          comments: data.comments || [],
        });
      })
      .catch(() => setError("No se pudo cargar el tema."))
      .finally(() => setLoading(false));
  }, [topicId]);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await fetch(`${apiUrl}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error();
        const userData = await res.json();
        setIsSaved(userData.savedOrientationalTopics.includes(topicId));
      } catch (e) {
        console.error("Error al verificar tema guardado", e);
      }
    };
    checkIfSaved();
  }, [topicId, showPopup]);

  const handleSaveTopic = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Debes iniciar sesión para guardar temas.");
    const res = await fetch(`${apiUrl}/user/save-orientational-topic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topicId }),
    });
    if (res.ok) {
      setPopupMessage("¡Tema guardado con éxito!");
      setShowPopup(true);
    } else {
      const data = await res.json();
      setError(data.errors[0]);
    }
  };

  const handleRemoveTopic = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Debes iniciar sesión para eliminar temas.");
    const res = await fetch(`${apiUrl}/user/remove-orientational-topic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topicId }),
    });
    if (res.ok) {
      setPopupMessage("¡Tema eliminado!");
      setShowPopup(true);
    } else {
      const data = await res.json();
      setError(data.errors[0]);
    }
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user"));
    const user = userData ? `${userData.name} ${userData.surname}` : "Usuario";
    const userId = userData?._id || null;
    const commentId = uuidv4();
    if (!newComment.trim()) return;
    await fetch(`${apiUrl}/topics-orientation/topic/${topicId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        _id: commentId,
        user,
        userId,
        message: newComment,
      }),
    });
    setTopic((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        { _id: commentId, user, userId, message: newComment },
      ],
    }));
    setNewComment("");
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
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="title-container">
            <h1>{topic.title}</h1>
          </div>
          <div className="formatted-text light-mode">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
            >
              {topic.text}
            </ReactMarkdown>
          </div>
          {topic.videos.length > 0 &&
            topic.videos.some((v) => v.trim() !== "") && (
              <>
                <div className="section-divider">
                  <span>🎥 Videos de referencia</span>
                </div>
                <div className="video-container">
                  {topic.videos
                    .filter((link) => link.trim() !== "")
                    .map((link, index) => (
                      <div key={index} className="video-wrapper">
                        <iframe
                          width="80%"
                          height="315"
                          src={toEmbedURL(link)}
                          title={`Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ))}
                </div>
              </>
            )}
          <div className="comments-section">
            <h3>💬 Comentarios:</h3>
            <ul className="comments-list">
              {topic.comments.map((c, i) => (
                <li key={i}>
                  <strong>{c.user}</strong>: {c.message}
                </li>
              ))}
            </ul>
            <textarea
              className="comment-input"
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="comment-button" onClick={handlePostComment}>
              Publicar
            </button>
          </div>
          <RecommendedTopics title={topic.title} category="orientacional" />
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

export default TopicOrientacional;
