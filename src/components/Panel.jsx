import React, { useState } from "react";
import "../styles/Panel.css"; // Importar los estilos del Panel

const Panel = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <li onClick={togglePanel} className={isOpen ? "active" : ""}>
        {title}
        <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
      </li>
      {isOpen && (
        <div className="panel">
          {" "}
          {/* Cambié ul a div */}
          <ul className="panel-items">
            {items.map((item, index) => (
              <li key={index} className="panel-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Panel;
