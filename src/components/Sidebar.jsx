import React from "react";
import "../styles/Sidebar.css"; // Importar los estilos del Sidebar
import Panel from "./Panel";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const tutorDisciplinarItems = [
    "Menu item 1",
    "Menu item 2",
    "Menu item 3",
    "Menu item 4",
  ];
  const tutorOrientacionItems = [
    "Menu item 1",
    "Menu item 2",
    "Menu item 3",
    "Menu item 4",
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <Panel title="Tutoría Disciplinar" items={tutorDisciplinarItems} />
        <Panel title="Tutoría de Orientación" items={tutorOrientacionItems} />
      </ul>
    </div>
  );
};

export default Sidebar;
