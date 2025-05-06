import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RecommendedTopics from "./RecommendedTopics";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import ModalMessage from "./ModalMessage"; 
import "../styles/TopicDisciplinar.css";

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

const TopicDisciplinar = () => {
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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [modal, setModal] = useState({ show: false, title: "", message: "", actions: [] });

  useEffect(() => {
    if (
      location.state?.title &&
      location.state?.text &&
      location.state?.videos &&
      location.state?.comments
    )
      return;

    setLoading(true);
    const fetchTopic = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/topics-disciplinary/topic/${topicId}`
        );
        if (!response.ok) throw new Error("No se pudo obtener el tema.");

        const data = await response.json();
        setTopic({
          _id: data._id,
          title: data.title,
          text: data.text,
          videos: data.videos || [],
          comments: data.comments || [],
        });
      } catch (error) {
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

  const handlePostComment = async () => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user"));
    const user = userData ? `${userData.name} ${userData.surname}` : "Usuario";
    const userId = userData?._id || null;
    const commentId = uuidv4();

    if (!newComment.trim()) return;

    await fetch(`${apiUrl}/topics-disciplinary/topic/${topicId}/comment`, {
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



  // Actualizar
  const handleUpdateComment = async (commentId) => {
    const token = localStorage.getItem("authToken");
    await fetch(`${apiUrl}/topics-disciplinary/topic/${topicId}/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: editedMessage }),
    });
    setTopic((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c._id === commentId ? { ...c, message: editedMessage } : c
      ),
    }));
    setEditingCommentId(null);
  };

  // Eliminar
  const handleDeleteComment = (commentId) => {
    setModal({
      show: true,
      title: "¿Estás seguro?",
      message: "¿Deseas eliminar este comentario?",
      type: "red",
      actions: [
        { label: "Cancelar", onClick: () => setModal({ show: false }) },
        {
          label: "Sí, eliminar",
          onClick: async () => {
            const token = localStorage.getItem("authToken");
            await fetch(`${apiUrl}/topics-disciplinary/topic/${topicId}/comment/${commentId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setTopic((prev) => ({
              ...prev,
              comments: prev.comments.filter((c) => c._id !== commentId),
            }));
            setModal({ show: false });
          },
        },
      ],
    });
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
                          width="100%"
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
            <h3>💬 Comentarios: </h3>
            <ul className="comments-list">
              {topic.comments.map((c) => (
                <li key={c._id}>
                  <strong>{c.user}</strong>:{" "}
                  {editingCommentId === c._id ? (
                    <>
                      <textarea
                        className="comment-input edit-comment-input"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        placeholder="Edita tu comentario..."
                      ></textarea>
                      <div className="comment-edit-actions">
                        <button className="save-btn" onClick={() => handleUpdateComment(c._id)}>
                          Guardar
                        </button>
                        <button className="cancel-btn" onClick={() => setEditingCommentId(null)}>
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {c.message}
                      {c.userId === userId && (
                      <>
                        <button
                          title="Editar comentario"
                          onClick={() => {
                            setEditingCommentId(c._id);
                            setEditedMessage(c.message);
                          }}
                          className="icon-button edit-comment-btn"
                        >
                          ✏️
                        </button>
                        <button
                          title="Eliminar comentario"
                          onClick={() => handleDeleteComment(c._id)}
                          className="icon-button delete-comment-btn"
                        >
                          ❌
                        </button>
                      </>
                    )}
                    </>
                  )}
                </li>
              ))}
            </ul>
            <textarea
              className="comment-input"
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button className="comment-button" onClick={handlePostComment}>
              Publicar
            </button>
          </div>

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
      <ModalMessage {...modal} onClose={() => setModal({ show: false })} />
    </div>
  );
};

export default TopicDisciplinar;
