import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import Panel from "./Panel";

const Sidebar = ({ isOpen, toggleSidebar, toggleRef }) => {
  const sidebarRef = useRef(null);
  const [mainTopics, setMainTopics] = useState([]);
  const [orientationTopics, setOrientationTopics] = useState([]);
  const [subtopicsByMain, setSubtopicsByMain] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedMainTopics, setExpandedMainTopics] = useState({});
  const [openPanels, setOpenPanels] = useState({
    disciplinary: false,
    orientation: false,
    academic: false,
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userEmail = localStorage.getItem("userEmail");
  const isAcademic = userEmail?.includes("@academicos");

  // 🔲 Cerrar el sidebar si se hace clic fuera de él (excepto en el botón del menú)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !toggleRef?.current?.contains(event.target)
      ) {
        toggleSidebar(); // Cierra si se hace clic fuera
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar, toggleRef]);

  useEffect(() => {
    const fetchMainTopics = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/topics-disciplinary/main-topics-disciplinary`
        );
        if (!response.ok) throw new Error("Error al obtener main topics");
        const data = await response.json();
        setMainTopics(data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    const fetchOrientationTopics = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/topics-orientation/sidebarTopicsOrientation`
        );
        if (!response.ok) throw new Error("Error al obtener temas orientación");
        const data = await response.json();
        setOrientationTopics(data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchMainTopics();
    fetchOrientationTopics();
    setLoading(false);
  }, []);

  const fetchSubtopics = async (mainTopicId) => {
    if (subtopicsByMain[mainTopicId]) return; // ya cargado
    try {
      const response = await fetch(
        `${apiUrl}/topics-disciplinary/main-topic/${mainTopicId}`
      );
      if (!response.ok) throw new Error("Error al obtener subtemas");
      const data = await response.json();
      setSubtopicsByMain((prev) => ({ ...prev, [mainTopicId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMainTopic = async (id) => {
    await fetchSubtopics(id);
    setExpandedMainTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTopicClick = (type, topicId) => {
    navigate(
      type === "orientation"
        ? `/tutoria-orientacional/topic/${topicId}`
        : `/tutoria-disciplinar/topic/${topicId}`
    );
    toggleSidebar(); // 🔹 Cierra el sidebar al navegar
  };

  const togglePanel = (panel) => {
    setOpenPanels((prev) => ({
      disciplinary: panel === "disciplinary" ? !prev.disciplinary : false,
      orientation: panel === "orientation" ? !prev.orientation : false,
      academic: panel === "academic" ? !prev.academic : false,
    }));
    setExpandedMainTopics({}); // 🔹 Cierra los subitems al cambiar de panel
  };

  // 🔹 Funciones nuevas para cerrar sidebar al abrir gestión académica
  const handleNavigateAndClose = (path) => {
    navigate(path);
    toggleSidebar(); // 🔹 Cierra sidebar
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <Panel
          title="Tutoría disciplinar"
          isOpen={openPanels.disciplinary}
          togglePanel={() => togglePanel("disciplinary")}
          items={
            loading
              ? [{ label: "Cargando...", onClick: () => {} }]
              : error
              ? [{ label: "❌ Error", onClick: () => {} }]
              : mainTopics.map((main) => ({
                  label: main.title,
                  isSubPanel: true,
                  onToggle: () => toggleMainTopic(main._id),
                  subItems:
                    subtopicsByMain[main._id]?.map((sub) => ({
                      label: sub.title,
                      onClick: () => handleTopicClick("disciplinary", sub._id),
                    })) || [],
                }))
          }
        />

        <Panel
          title="Tutoría de orientación"
          isOpen={openPanels.orientation}
          togglePanel={() => togglePanel("orientation")}
          items={
            loading
              ? [{ label: "Cargando...", onClick: () => {} }]
              : error
              ? [{ label: "❌ Error", onClick: () => {} }]
              : orientationTopics.map((topic) => ({
                  label: topic.title,
                  onClick: () => handleTopicClick("orientation", topic._id),
                }))
          }
        />

        {isAcademic && (
          <Panel
            title="Gestión académica"
            isOpen={openPanels.academic}
            togglePanel={() => togglePanel("academic")}
            items={[
              {
                label: "Gestionar temas",
                onClick: () => handleNavigateAndClose("/manejo-temas"),
              },
              {
                label: "Temas principales",
                onClick: () => handleNavigateAndClose("/manejo-main-topics"),
              },
            ]}
          />
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
