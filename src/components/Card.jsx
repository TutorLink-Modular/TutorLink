import React from "react";
import { Link } from "react-router-dom";
import "../styles/Card.css";

const Card = ({ title, subtitle, description, imageUrl }) => {
  // Creamos nuestra funcion para detectar si el usuario selecciono Tutoria Disciplinar o Tutoria de Orientacion
  const modifyLinkTutorials = (title) => {
    let link = "";
    if(title == "Tutoría Disciplinar"){
      link = "/tutoria-disciplinar";
    }
    else if(title == "Tutoría de Orientación"){
      link = "/tutoria-orientacional";
    }
    // Retornamos el link correspondiente para que el usuario sea redirigido
    return link;
  }

  return (
    <div className="card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h4 className="card-subtitle">{subtitle}</h4>
        <p className="card-description">{description}</p>
        <Link to={modifyLinkTutorials(title)}>
          <button className="card-button">Enter</button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
