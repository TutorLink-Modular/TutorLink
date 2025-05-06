import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import ModalMessage from "./ModalMessage";
import "../styles/ManageTopics.css";

const ManageTopics = () => {
  const [selectedTutoria, setSelectedTutoria] = useState("");
  const [mainTopics, setMainTopics] = useState([]);
  const [selectedMainTopic, setSelectedMainTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [modal, setModal] = useState({ show: false, title: "", message: "", actions: [] });
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
        .catch((err) => console.error("Error cargando temas orientacionales", err));
    } else {
      setTopics([]);
    }
  }, [selectedTutoria, selectedMainTopic]);

  const showConfirmation = (message, onConfirm) => {
    setModal({
      show: true,
      title: "Confirmación",
      message,
      type: "red",
      actions: [
        { label: "Cancelar", onClick: () => setModal({ show: false }) },
        {
          label: "Sí, eliminar",
          onClick: () => {
            setModal({ show: false });
            onConfirm();
          },
        },
      ],
    });
  };

  const handleDelete = async (id) => {
    const url =
      selectedTutoria === "disciplinar"
        ? `${apiUrl}/topics-disciplinary/topic/${id}`
        : `${apiUrl}/topics-orientation/topic/${id}`;

    showConfirmation("¿Estás seguro que deseas eliminar este tema?", async () => {
      try {
        const response = await fetch(url, { method: "DELETE" });
        if (response.ok) {
          setModal({
            show: true,
            title: "Éxito",
            message: "Tema eliminado correctamente.",
            actions: [{ label: "Aceptar", onClick: () => setModal({ show: false }) }],
          });
          setTopics((prev) => prev.filter((t) => t._id !== id));
        } else {
          throw new Error("Error al eliminar tema");
        }
      } catch (err) {
        console.error(err);
        setModal({
          show: true,
          title: "Error",
          message: "No se pudo eliminar el tema.",
          actions: [{ label: "Cerrar", onClick: () => setModal({ show: false }) }],
        });
      }
    });
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {(selectedTutoria === "orientacional" ||
        (selectedTutoria === "disciplinar" && selectedMainTopic)) && (
        <button
          className="add-topic-btn"
          onClick={() =>
            navigate(`/manejo-temas/nuevo/${selectedTutoria}`, {
              state: { selectedMainTopic },
            })
          }
        >
          Agregar nuevo tema
        </button>
      )}

      {(selectedTutoria === "orientacional" ||
        (selectedTutoria === "disciplinar" && selectedMainTopic)) && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar tema por título..."
          />
        </>
      )}

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
            {filteredTopics.map((topic) => (
              <tr key={topic._id}>
                <td>{topic.title}</td>
                <td title={topic.description}>{topic.description}</td>
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

      <ModalMessage {...modal} onClose={() => setModal({ show: false })} />
    </div>
  );
};

export default ManageTopics;
