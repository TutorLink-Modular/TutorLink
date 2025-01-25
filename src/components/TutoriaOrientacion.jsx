import React from "react";
import Card from "./CardTutorials";
import image2 from "../assets/images/orientacion.png";
import "../styles/CardContainer.css";

const TutoriaOrientacion = () => {
  const cardsData = [
    {
      title: "Topic 1",
      subtitle: "subtitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image2,
    },
    {
      title: "Topic 2",
      subtitle: "subtitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image2,
    },
    {
      title: "Topic 3",
      subtitle: "subtitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image2,
    },
  ];

  return (
    <div className="card-container">
      <h1 className="title">Tutoría De Orientación</h1>
      {cardsData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          imageUrl={card.imageUrl}
        />
      ))}
    </div>
  );
};

export default TutoriaOrientacion;
