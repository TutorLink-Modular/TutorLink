import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageTopics.css";

const ManageMainTopics = () => {
  const [mainTopics, setMainTopics] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/topics-disciplinary/main-topics-disciplinary`)
      .then((res) => res.json())
      .then((data) => setMainTopics(data))
      .catch((err) => console.error("Error cargando main topics:", err));
  }, []);

  const handleDelete = async (id) => {
    const confirm1 = window.confirm(
      "¿Estás seguro que deseas eliminar este tema principal?"
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      "⚠️ Este tema principal tiene subtemas. Si continúas, se eliminarán también. ¿Deseas continuar?"
    );
    if (!confirm2) return;

    try {
      const response = await fetch(
        `${apiUrl}/topics-disciplinary/main-topics-disciplinary/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Tema principal y sus subtemas eliminados correctamente.");
        setMainTopics((prev) => prev.filter((t) => t._id !== id));
      } else {
        throw new Error("Error al eliminar main topic.");
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el tema principal.");
    }
  };

  return (
    <div className="manage-topics-container">
      <h1 className="manage-topics-title">
        Manejo de Temas Principales de tutoria Disciplinar
      </h1>
      <p className="manage-topics-description">
        Aquí puedes ver, editar, eliminar o agregar temas principales.
      </p>

      <button
        className="add-topic-btn"
        onClick={() => navigate("/manejo-main-topics/nuevo")}
      >
        Agregar nuevo tema principal
      </button>

      <table className="topics-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mainTopics.map((topic) => (
            <tr key={topic._id}>
              <td>{topic.title}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/manejo-main-topics/editar/${topic._id}`)
                  }
                >
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(topic._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMainTopics;
