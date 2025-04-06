// src/components/TopicFormModal.jsx
import React, { useState, useEffect } from "react";
import "../styles/TopicFormModal.css";

const TopicFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isDisciplinar,
  selectedMainTopicId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    text: "",
    idMainTopic: "",
    videos: [""],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        text: "",
        idMainTopic: isDisciplinar ? selectedMainTopicId : "",
        videos: [""],
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = value;
    setFormData({ ...formData, videos: updatedVideos });
  };

  const addVideoField = () =>
    setFormData({ ...formData, videos: [...formData.videos, ""] });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{initialData ? "Editar Tema" : "Agregar Tema"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
          />
          <textarea
            name="text"
            placeholder="Contenido del tema"
            value={formData.text}
            onChange={handleChange}
            required
          />

          {formData.videos.map((video, index) => (
            <input
              key={index}
              placeholder={`Video ${index + 1}`}
              value={video}
              onChange={(e) => handleVideoChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addVideoField}>
            Agregar otro video
          </button>

          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicFormModal;
