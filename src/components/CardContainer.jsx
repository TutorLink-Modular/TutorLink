import React from "react";
import Card from "./Card";
import image1 from "../assets/images/disciplinar.png";
import image2 from "../assets/images/orientacion.png";
import "../styles/CardContainer.css";

const CardContainer = () => {
  const cardsData = [
    {
      title: "Tutoría Disciplinar",
      subtitle: "Title",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image1,
    },
    {
      title: "Tutoría Disciplinar",
      subtitle: "Title",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image2,
    },
  ];

  return (
    <div className="card-container">
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

export default CardContainer;
