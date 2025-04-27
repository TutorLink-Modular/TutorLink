import React, { useState } from "react";
import "../styles/Panel.css";

const Panel = ({ title, items, isOpen, togglePanel }) => {
  const [openSubPanels, setOpenSubPanels] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const toggleSubPanel = (index) => {
    setOpenSubPanels((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={`panel ${isOpen ? "open" : ""}`}>
      <h3 onClick={togglePanel} className="title-panel">
        {title}
        <span className="toggle-icon">{isOpen ? "▲" : "▼"}</span>
      </h3>
      <ul
        className="panel-items"
        style={{ maxHeight: isOpen ? "max-content" : "0" }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`panel-item ${
              activeItem === index ? "active-item" : ""
            }`}
          >
            {item.isSubPanel ? (
              <>
                <div
                  onClick={() => {
                    toggleSubPanel(index);
                    item.onToggle?.();
                    setActiveItem(index);
                    setActiveSubItem(null); // Limpiar subtema seleccionado
                  }}
                  className={`subpanel-toggle ${
                    openSubPanels[index] ? "open-subpanel" : ""
                  }`}
                >
                  {item.label}
                  <span className="toggle-icon">
                    {openSubPanels[index] ? "▲" : "▼"}
                  </span>
                </div>
                {openSubPanels[index] && (
                  <ul className="subpanel-items">
                    {item.subItems?.map((sub, subIdx) => (
                      <li
                        key={subIdx}
                        onClick={() => {
                          setActiveItem(index);
                          setActiveSubItem(`${index}-${subIdx}`);
                          sub.onClick?.();
                        }}
                        className={`panel-subitem ${
                          activeSubItem === `${index}-${subIdx}`
                            ? "active-subitem"
                            : ""
                        }`}
                      >
                        {sub.label}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div
                onClick={() => {
                  item.onClick?.();
                  setActiveItem(index);
                  setActiveSubItem(null);
                }}
              >
                {item.label}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Panel;
