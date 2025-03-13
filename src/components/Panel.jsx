import React from "react";
import "../styles/Panel.css";

const Panel = ({ title, items, isOpen, togglePanel }) => {
  return (
    <div className={`panel ${isOpen ? "open" : ""}`}>
      <h3 onClick={togglePanel} className="title-panel">
        {title}
        <span className="toggle-icon">{isOpen ? "▲" : "▼"}</span>
      </h3>
      <ul className="panel-items" style={{ maxHeight: isOpen ? "max-content" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        {items.map((item, index) => (
          <li key={index} onClick={item.onClick} className="panel-item">
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Panel;
