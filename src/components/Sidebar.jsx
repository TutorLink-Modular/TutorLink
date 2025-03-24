import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import Panel from "./Panel";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [disciplinaryTopics, setDisciplinaryTopics] = useState([]);
  const [orientationTopics, setOrientationTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [openPanels, setOpenPanels] = useState({
    disciplinary: false,
    orientation: false,
  });

  useEffect(() => {
    const fetchTopics = async (url, setTopics) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setTopics(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(true);
      }
    };

    Promise.all([
      fetchTopics(`${apiUrl}/topics-orientation/sidebarTopicsOrientation`, setOrientationTopics),
      fetchTopics(`${apiUrl}/topics-disciplinary/sidebarTopicsDisciplinary`, setDisciplinaryTopics)
    ]).finally(() => setLoading(false));
  }, []);

  const handleTopicClick = (type, topicId) => {
    navigate(type === "orientation" ? `/tutoria-orientacional/topic/${topicId}` : `/tutoria-disciplinar/topic/${topicId}`);
  };

  const togglePanel = (panel) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <Panel
          title="Tutoría disciplinar"
          isOpen={openPanels.disciplinary}
          togglePanel={() => togglePanel("disciplinary")}
          items={loading ? [{ label: "Cargando temas...", onClick: () => {} }] :
            error ? [{ label: "❌ Error al cargar temas", onClick: () => {} }] :
            disciplinaryTopics.map(topic => ({
              label: topic.title,
              onClick: () => handleTopicClick("disciplinary", topic._id),
            }))}
        />

        <Panel
          title="Tutoría de orientación"
          isOpen={openPanels.orientation}
          togglePanel={() => togglePanel("orientation")}
          items={loading ? [{ label: "Cargando temas...", onClick: () => {} }] :
            error ? [{ label: "❌ Error al cargar temas", onClick: () => {} }] :
            orientationTopics.map(topic => ({
              label: topic.title,
              onClick: () => handleTopicClick("orientation", topic._id),
            }))}
        />
      </ul>
    </div>
  );
};

export default Sidebar;