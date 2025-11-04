import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import ModalMessage from "./ModalMessage";
import "../styles/ManageTopics.css";

const ManageMainTopics = () => {
  const [mainTopics, setMainTopics] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState({ show: false, title: "", message: "", actions: [] });

  useEffect(() => {
    fetch(`${apiUrl}/topics-disciplinary/main-topics-disciplinary`)
      .then((res) => res.json())
      .then((data) => setMainTopics(data))
      .catch((err) => console.error("Error cargando main topics:", err));
  }, []);

  const showConfirmation = (message, onConfirm) => {
    setModal({
      show: true,
      title: "Confirmación",
      message,
      type: "red",
      actions: [
        { label: "Cancelar", onClick: () => setModal({ show: false }) },
        {
          label: "Sí, continuar",
          onClick: () => {
            setModal({ show: false });
            onConfirm();
          },
        },
      ],
    });
  };

  const handleDelete = async (id) => {
    showConfirmation(
      "¿Estás seguro que deseas eliminar este tema principal?",
      () => {
        showConfirmation(
          "⚠️ Este tema principal puede tener subtemas. Si continúas, se eliminarán también. ¿Deseas continuar?",
          async () => {
            try {
              const response = await fetch(
                `${apiUrl}/topics-disciplinary/main-topics-disciplinary/${id}`,
                { method: "DELETE" }
              );
              if (response.ok) {
                setModal({
                  show: true,
                  title: "Éxito",
                  message: "Tema principal y sus subtemas eliminados correctamente.",
                  actions: [{ label: "Aceptar", onClick: () => setModal({ show: false }) }],
                });
                setMainTopics((prev) => prev.filter((t) => t._id !== id));
              } else {
                throw new Error("Error al eliminar main topic.");
              }
            } catch (err) {
              console.error(err);
              setModal({
                show: true,
                title: "Error",
                message: "No se pudo eliminar el tema principal.",
                actions: [{ label: "Cerrar", onClick: () => setModal({ show: false }) }],
              });
            }
          }
        );
      }
    );
  };

  const filteredTopics = mainTopics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar tema por título..."
      />

      <table className="topics-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <tr key={topic._id}>
                <td>{topic.title}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/manejo-main-topics/editar/${topic._id}`)}
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
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-topics-message">
                No se encontraron temas principales.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ModalMessage {...modal} onClose={() => setModal({ show: false })} />
    </div>
  );
};

export default ManageMainTopics;
