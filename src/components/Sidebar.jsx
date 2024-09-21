// src/components/Sidebar.jsx
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Asegúrate de que Font Awesome esté cargado
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          Tutoría Disciplinar
          <i className="fas fa-chevron-down"></i> {/* Flecha hacia abajo */}
        </li>
        <li>
          Tutoría de Orientación
          <i className="fas fa-chevron-down"></i> {/* Flecha hacia abajo */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
