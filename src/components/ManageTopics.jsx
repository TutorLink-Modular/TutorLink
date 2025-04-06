import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageTopics.css";

const ManageTopics = () => {
  const [selectedTutoria, setSelectedTutoria] = useState("");
  const [mainTopics, setMainTopics] = useState([]);
  const [selectedMainTopic, setSelectedMainTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTutoria === "disciplinar") {
      fetch(`${apiUrl}/topics-disciplinary/main-topics-disciplinary`)
        .then((res) => res.json())
        .then((data) => setMainTopics(data))
        .catch((err) => console.error("Error cargando main topics", err));
    }
  }, [selectedTutoria]);

  useEffect(() => {
    if (selectedTutoria === "disciplinar" && selectedMainTopic) {
      fetch(`${apiUrl}/topics-disciplinary/main-topic/${selectedMainTopic}`)
        .then((res) => res.json())
        .then((data) => setTopics(data))
        .catch((err) => console.error("Error cargando temas", err));
    } else if (selectedTutoria === "orientacional") {
      fetch(`${apiUrl}/topics-orientation/topicsOrientationCards`)
        .then((res) => res.json())
        .then((data) => setTopics(data))
        .catch((err) =>
          console.error("Error cargando temas orientacionales", err)
        );
    } else {
      setTopics([]); // Limpiar temas si no hay selección válida
    }
  }, [selectedTutoria, selectedMainTopic]);

  const handleDelete = async (id) => {
    const url =
      selectedTutoria === "disciplinar"
        ? `${apiUrl}/topics-disciplinary/topic/${id}`
        : `${apiUrl}/topics-orientation/topic/${id}`;

    if (window.confirm("¿Estás seguro que deseas eliminar este tema?")) {
      try {
        const response = await fetch(url, { method: "DELETE" });
        if (response.ok) {
          alert("Tema eliminado correctamente.");
          setTopics((prev) => prev.filter((t) => t._id !== id));
        } else {
          throw new Error("Error al eliminar tema");
        }
      } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el tema.");
      }
    }
  };

  return (
    <div className="manage-topics-container">
      <h1 className="manage-topics-title">Manejo de temas</h1>
      <p className="manage-topics-description">
        Desde aquí puedes visualizar, editar, eliminar o agregar nuevos temas.
      </p>

      <div className="dropdowns">
        <select
          value={selectedTutoria}
          onChange={(e) => {
            setSelectedTutoria(e.target.value);
            setSelectedMainTopic("");
            setTopics([]);
          }}
        >
          <option value="">Selecciona una tutoría</option>
          <option value="disciplinar">Tutoría Disciplinar</option>
          <option value="orientacional">Tutoría de Orientación</option>
        </select>

        {selectedTutoria === "disciplinar" && (
          <select
            value={selectedMainTopic}
            onChange={(e) => setSelectedMainTopic(e.target.value)}
          >
            <option value="">Selecciona un tema principal</option>
            {mainTopics.map((main) => (
              <option key={main._id} value={main._id}>
                {main.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ✅ Mostrar tabla si hay temas */}
      {topics.length > 0 ? (
        <table className="topics-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic._id}>
                <td>{topic.title}</td>
                <td>{topic.description}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(
                        `/manejo-temas/edit/${selectedTutoria}/${topic._id}`,
                        {
                          state: {
                            topic,
                            selectedTutoria,
                            selectedMainTopic,
                          },
                        }
                      )
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
      ) : (
        selectedTutoria &&
        ((selectedTutoria === "disciplinar" && selectedMainTopic) ||
          selectedTutoria === "orientacional") && (
          <p className="no-topics-message">
            No hay temas disponibles para mostrar.
          </p>
        )
      )}
    </div>
  );
};

export default ManageTopics;
