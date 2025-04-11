import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/TopicFormPage.css";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

const TopicFormPage = () => {
  const { id, tipo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isNew = !id || id === "new";
  const isDisciplinar = tipo === "disciplinar";
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    text: "",
    image: "",
    idMainTopic: isDisciplinar ? location.state?.selectedMainTopic || "" : "",
    videos: [""],
  });

  useEffect(() => {
    if (!isNew) {
      const endpoint = isDisciplinar
        ? `${apiUrl}/topics-disciplinary/topic/${id}`
        : `${apiUrl}/topics-orientation/topic/${id}`;

      fetch(endpoint)
        .then((res) => {
          if (!res.ok) throw new Error("Tema no encontrado");
          return res.json();
        })
        .then((data) => {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            text: data.text || "",
            image: data.image || "",
            idMainTopic: data.idMainTopic || "",
            videos: Array.isArray(data.videos) ? data.videos : [""],
          });
        })
        .catch((err) => {
          console.error("❌ Error al cargar el tema:", err);
          alert("No se pudo cargar el tema.");
          navigate("/manejo-temas");
        });
    }
  }, [id, isDisciplinar]);

  // 🔒 Elimina cualquier input file oculto para subir imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      const fileInputs = document.querySelectorAll("input[type='file']");
      fileInputs.forEach((input) => {
        if (input.closest(".rc-md-editor")) {
          input.remove();
        }
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = value;
    setFormData({ ...formData, videos: updatedVideos });
  };

  const addVideoField = () => {
    setFormData((prev) => ({ ...prev, videos: [...prev.videos, ""] }));
  };

  const removeVideoField = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isDisciplinar
      ? `${apiUrl}/topics-disciplinary/topic${isNew ? "" : `/${id}`}`
      : `${apiUrl}/topics-orientation/topic${isNew ? "" : `/${id}`}`;

    const body = {
      ...formData,
      idMainTopic: isDisciplinar
        ? formData.idMainTopic || location.state?.selectedMainTopic || ""
        : "",
    };

    try {
      const response = await fetch(endpoint, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Error al guardar el tema");

      alert(`Tema ${isNew ? "creado" : "actualizado"} correctamente`);
      navigate("/manejo-temas");
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      alert("Error al guardar el tema.");
    }
  };

  return (
    <div className="topic-form-page">
      <h2>{isNew ? "Agregar Tema" : "Editar Tema"}</h2>
      <form onSubmit={handleSubmit} className="topic-form">
        <label>
          <span>Título</span>
          <input
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Descripción</span>
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Contenido del tema</span>
          <MdEditor
            style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}
            value={formData.text}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
            onChange={({ text }) => setFormData((prev) => ({ ...prev, text }))}
            config={{
              view: { menu: true, md: true, html: false },
              image: false,
            }}
            onImageUpload={() => Promise.reject()}
          />
          <div className="markdown-help">
            <p>
              <strong>Guía rápida de formato:</strong>
            </p>
            <ul>
              <li>
                <code># Título</code>, <code>## Subtítulo</code>
              </li>
              <li>
                <code>**negrita**</code>, <code>*cursiva*</code>,{" "}
                <code>__subrayado__</code>
              </li>
              <li>
                <code>- Lista</code>, <code>1. Lista numerada</code>
              </li>
              <li>
                <code>[enlace](https://ejemplo.com)</code>
              </li>
              <li>
                <code>`código en línea`</code>,{" "}
                <code>```bloque de código```</code>
              </li>
              <li>
                <code>| tabla | markdown |</code>
              </li>
              <li>
                <code>![imagen](url)</code> ❌ <em>(no disponible)</em>
              </li>
            </ul>
          </div>
        </label>

        <label>
          <span>Videos relacionados</span>
        </label>
        {formData.videos.map((video, index) => (
          <div key={index} className="video-input-group">
            <input
              placeholder={`Video ${index + 1}`}
              value={video}
              onChange={(e) => handleVideoChange(index, e.target.value)}
            />
            {formData.videos.length > 1 && (
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
