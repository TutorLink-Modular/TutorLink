import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/TopicFormPage.css";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import ModalMessage from "./ModalMessage"; 

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

  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState({ show: false, title: "", message: "", actions: [] });

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
          setModal({
            show: true,
            title: "Error",
            message: "No se pudo cargar el tema.",
            actions: [{ label: "Aceptar", onClick: () => navigate("/manejo-temas") }],
          });
        });
    }
  }, [id, isDisciplinar]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fileInputs = document.querySelectorAll("input[type='file']");
      fileInputs.forEach((input) => {
        if (input.closest(".rc-md-editor")) input.remove();
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
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

    const errors = {};
    if (!formData.title.trim()) errors.title = "El título es obligatorio";
    if (!formData.text.trim()) errors.text = "El contenido es obligatorio";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

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

      setModal({
        show: true,
        title: "Éxito",
        message: `Tema ${isNew ? "creado" : "actualizado"} correctamente`,
        actions: [{ label: "Aceptar", onClick: () => navigate("/manejo-temas") }],
      });
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      setModal({
        show: true,
        title: "Error",
        message: "No se pudo guardar el tema.",
        actions: [{ label: "Cerrar", onClick: () => setModal({ show: false }) }],
      });
    }
  };

  return (
    <div className="topic-form-page">
      <h2>{isNew ? "Agregar Tema" : "Editar Tema"}</h2>
      <form onSubmit={handleSubmit} className="topic-form">
        <label>
          <span>
            Título <span style={{ color: "red" }}>*</span>
          </span>
          <input
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            className={formErrors.title ? "input-error" : ""}
          />
          {formErrors.title && (
            <p className="error-message">{formErrors.title}</p>
          )}
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
          <span>URL de Imagen</span>
          <input
            name="image"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.image}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>
            Contenido del tema <span style={{ color: "red" }}>*</span>
          </span>
          <div className={formErrors.text ? "input-error" : ""}>
            <MdEditor
              style={{
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                border: formErrors.text
                  ? "2px solid #d9363e"
                  : "2px solid #757fa6",
              }}
              value={formData.text}
              renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              onChange={({ text }) =>
                setFormData((prev) => ({ ...prev, text }))
              }
              config={{
                view: { menu: true, md: true, html: false },
                image: false,
              }}
              onImageUpload={() => Promise.reject()}
            />
          </div>
          {formErrors.text && (
            <p className="error-message">{formErrors.text}</p>
          )}
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

      <ModalMessage {...modal} onClose={() => setModal({ show: false })} />
    </div>
  );
};

export default TopicFormPage;