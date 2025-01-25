import React from "react";
import { Link } from "react-router-dom";
import "../styles/CardTutorials.css";

const Card = ({ title, subtitle, description, imageUrl }) => {

  const modifyLinkTutorials = () => {
    let link = "/other";
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
        <Link to={modifyLinkTutorials()}>
          <button className="card-button">Enter</button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
