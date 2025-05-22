import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ModalMessage from "./ModalMessage";
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

  const [modal, setModal] = useState({ show: false, title: "", message: "", actions: [] });
  const [isSaving, setIsSaving] = useState(false);

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
          setModal({
            show: true,
            title: "Error",
            message: "No se pudo cargar el tema principal.",
            actions: [
              { label: "Cerrar", onClick: () => { setModal({ show: false }); navigate("/manejo-main-topics"); } }
            ]
          });
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
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

      setModal({
        show: true,
        title: "Éxito",
        message: `Main topic ${isEdit ? "actualizado" : "creado"} correctamente`,
        type: "",
        actions: [
          {
            label: "Aceptar",
            onClick: () => {
              setModal({ show: false });
              navigate("/manejo-main-topics");
            },
          },
        ],
      });
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      setModal({
        show: true,
        title: "Error",
        message: "Error al guardar el main topic.",
        actions: [{ label: "Cerrar", onClick: () => setModal({ show: false }) }],
      });
    }finally {
      setIsSaving(false);
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
          <button type="submit" disabled={isSaving}>
            {isSaving ? <span className="loader"></span> : "Guardar"}
          </button>
          <button type="button" onClick={() => navigate("/manejo-main-topics")}>Cancelar</button>
        </div>
      </form>
      <ModalMessage {...modal} onClose={() => setModal({ show: false })} />
    </div>
  );
};

export default MainTopicFormPage;
