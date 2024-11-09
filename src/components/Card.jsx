import React from "react";
import "../styles/Card.css";

const Card = ({ title, subtitle, description, imageUrl }) => {
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
        <button className="card-button">Enter</button>
      </div>
    </div>
  );
};

export default Card;
