import React from "react";
import { Link } from "react-router-dom";
import "../styles/CardTutorials.css";

// CardTutorials solo muestra el titulo, y la descripcion y la imagemen correspondiente de cada uno
const CardTutorials = ({ title, description, imageUrl, defaultImage, onClick }) => {
  return (
    <div className="cardTutorials">
      <img 
        src={imageUrl} 
        alt={title} 
        onError={(e) => {e.target.src = defaultImage;}}
      />
      <div className="cardTutorials-content">
        <h3 className="cardTutorials-title">{title}</h3>
        <p className="cardTutorials-description">{description}</p>
        <Link to="#" onClick={onClick}>
          <button className="cardTutorials-button">Enter</button>
        </Link>
      </div>
    </div>
  );
};

export default CardTutorials;

