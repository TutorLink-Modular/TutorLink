import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TopicFormPage.css";

const MainTopicFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`${apiUrl}/topics-disciplinary/main-topics-disciplinary/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("No se encontró el main topic.");
          return res.json();
        })
        .then((data) => {
          setFormData({
            title: data.title || "",
            description: data.description || "",
          });
        })
        .catch((err) => {
          console.error("❌ Error al cargar main topic:", err);
          alert("Error al cargar main topic");
          navigate("/manejo-main-topics");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${apiUrl}/topics-disciplinary/main-topics-disciplinary${
      isEdit ? `/${id}` : ""
    }`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar");

      alert(`Main topic ${isEdit ? "actualizado" : "creado"} correctamente`);
      navigate("/manejo-main-topics");
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      alert("Error al guardar el main topic.");
    }
  };

  return (
    <div className="topic-form-page">
      <h2>{isEdit ? "Editar Main Topic" : "Agregar Main Topic"}</h2>
      <form onSubmit={handleSubmit} className="topic-form">
        <label>
          <span>Título</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Descripción</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <div className="form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => navigate("/manejo-main-topics")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainTopicFormPage;
