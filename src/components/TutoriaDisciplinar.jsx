import React from "react";
import Card from "./CardTutorials";
import image1 from "../assets/images/disciplinar.png";
import "../styles/TutoriaDisciplinar.css";

const TutoriaDisciplinar = () => {
  const cardsData = [
    {
      title: "Topic 1",
      subtitle: "subtitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image1,
    },
    {
      title: "Topic 2",
      subtitle: "subtitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image1,
    },
    {
      title: "Topic 3",
      subtitle: "subtitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      imageUrl: image1,
    },
  ];

  return (
    <div className="card-container">
      <h1 className="title">Tutoría Disciplinar</h1>
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

export default TutoriaDisciplinar;
