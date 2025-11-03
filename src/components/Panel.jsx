import React, { useEffect, useState } from "react";
import "../styles/Panel.css";

const Panel = ({ title, items, isOpen, togglePanel }) => {
  const [openSubPanels, setOpenSubPanels] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const toggleSubPanel = (index) => {
    setOpenSubPanels((prev) => {
      const isCurrentlyOpen = !!prev[index];
      const newState = { ...prev, [index]: !isCurrentlyOpen };

      // 🧠 Si el subpanel se está cerrando, quitamos la selección
      if (isCurrentlyOpen) {
        setActiveItem(null);
        setActiveSubItem(null);
      }

      return newState;
    });
  };

  // 🧹 NUEVO: Cuando el panel principal cambia (se cierra o abre otro),
  // limpiamos la selección y subpanels abiertos
  useEffect(() => {
    if (!isOpen) {
      setActiveItem(null);
      setActiveSubItem(null);
      setOpenSubPanels({});
    }
  }, [isOpen]);

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
            className={`panel-item ${item.isSubPanel ? "has-subitems" : ""} ${
              activeItem === index ? "active-item" : ""
            }`}
          >
            {item.isSubPanel ? (
              <>
                <div
                  onClick={() => {
                    toggleSubPanel(index);
                    item.onToggle?.();
                    // Solo marcamos activo al abrir
                    if (!openSubPanels[index]) {
                      setActiveItem(index);
                      setActiveSubItem(null);
                    }
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
                          // 🔹 Antes de seleccionar, limpiamos todo lo anterior
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
                  // 🔹 Al hacer clic en otro tema, limpiamos selección previa
                  setActiveItem(index);
                  setActiveSubItem(null);
                  item.onClick?.();
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
