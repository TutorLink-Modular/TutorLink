import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TopicFormPage.css";

const TopicFormPage = () => {
  const { id } = useParams();
  const [topicData, setTopicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const isDisciplinar = window.location.pathname.includes("disciplinar");
  const endpoint = isDisciplinar
    ? `${apiUrl}/topics-disciplinary/topic/${id}`
    : `${apiUrl}/topics-orientation/topic/${id}`;

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        setTopicData({
          ...data,
          description: data.description || "",
          image: data.image || "",
          videos:
            Array.isArray(data.videos) && data.videos.length > 0
              ? data.videos
              : [""],
        });
      } catch (err) {
        console.error("Error al obtener el tema:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [endpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopicData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...topicData.videos];
    updatedVideos[index] = value;
    setTopicData({ ...topicData, videos: updatedVideos });
  };

  const addVideoField = () => {
    setTopicData((prev) => ({ ...prev, videos: [...prev.videos, ""] }));
  };

  const removeVideoField = (indexToRemove) => {
    const updatedVideos = topicData.videos.filter(
      (_, i) => i !== indexToRemove
    );
    setTopicData({ ...topicData, videos: updatedVideos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isDisciplinar
      ? `${apiUrl}/topics-disciplinary/topic/${id}`
      : `${apiUrl}/topics-orientation/topic/${id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicData),
      });

      if (!response.ok) throw new Error("Error al actualizar el tema");

      alert("Tema actualizado con éxito");
      navigate("/manejo-temas");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al actualizar el tema.");
    }
  };

  if (isLoading || !topicData) return <p>Cargando tema...</p>;

  return (
    <div className="topic-form-page">
      <h2>Editar Tema</h2>
      <form onSubmit={handleSubmit} className="topic-form">
        <input
          name="title"
          placeholder="Título"
          value={topicData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={topicData.description}
          onChange={handleChange}
        />

        <textarea
          name="text"
          placeholder="Contenido del tema"
          value={topicData.text}
          onChange={handleChange}
          required
        />

        {topicData.videos.map((video, index) => (
          <div key={index} className="video-input-group">
            <input
              placeholder={`Video ${index + 1}`}
              value={video}
              onChange={(e) => handleVideoChange(index, e.target.value)}
            />
            {topicData.videos.length > 1 && (
              <button
                type="button"
                className="remove-video-btn"
                onClick={() => removeVideoField(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addVideoField}>
          Agregar otro video
        </button>

        <div className="form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => navigate("/manejo-temas")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopicFormPage;
