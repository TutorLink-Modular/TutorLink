import React from "react";
import "../styles/HeaderDisciplinar.css";

const HeaderDisciplinar = ({ title, subtitle, imageSrc }) => {
  return (
    <div className="header-disciplinar-container">
      <h1 className="header-title">{title}</h1>
      <div className="header-content">
        <div className="header-image">
          <img src={imageSrc} alt={title} />
        </div>
        <div className="header-text">
          <h2>¿Qué puedes encontrar aquí?</h2>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderDisciplinar;
