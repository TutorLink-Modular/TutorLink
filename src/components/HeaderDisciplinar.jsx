import React from "react";
import "../styles/HeaderDisciplinar.css";
import image from "../assets/images/HeaderDisciplinar.png"; // Asegúrate de colocar la imagen correcta en la carpeta assets

const HeaderDisciplinar = () => {
  return (
    <div className="header-disciplinar-container">
      <h1 className="header-title">Tutoría Disciplinar</h1>
      <div className="header-content">
        <div className="header-image">
          <img src={image} alt="Tutoría Disciplinar" />
        </div>
        <div className="header-text">
          <h2>¿Qué puedes encontrar aquí?</h2>
          <p>
            Explora una variedad de temas disciplinares cuidadosamente diseñados
            para impulsar tu crecimiento personal y académico. A través de
            recursos especializados y enfoques innovadores, amplía tus
            conocimientos, desarrolla nuevas habilidades y fortalece tu
            formación en distintas áreas del saber.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderDisciplinar;
