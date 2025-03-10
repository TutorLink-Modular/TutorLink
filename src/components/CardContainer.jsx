import React from "react";
import Card from "./Card";
import image1 from "../assets/images/disciplinar.png";
import image2 from "../assets/images/orientacion.png";
import "../styles/CardContainer.css";

const CardContainer = () => {
  const cardsData = [
    {
      title: "Tutoría disciplinar",
      subtitle: "¿Qué es?",
      description:
        "Se refiere a la orientación y el acompañamiento que se realiza para gestionar el comportamiento y la disciplina de los estudiantes en el ámbito escolar. El tutor o tutora no sólo se enfoca en el rendimiento académico, sino también en ayudar a los estudiantes a desarrollar actitudes positivas, responsabilidades, respeto por las normas y una conducta adecuada dentro del contexto escolar.",
      imageUrl: image1,
    },
    {
      title: "Tutoría de orientación",
      subtitle: "¿Qué es?",
      description:
        "Se enfoca más en el desarrollo personal, social y emocional del estudiante. El tutor o tutora ofrece apoyo en aspectos como la toma de decisiones y la organización de la vida académica y personal, así como la orientación vocacional. Este tipo de tutoría también aborda aspectos relacionados con la autoestima, las relaciones interpersonales y el bienestar general del estudiante.",
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
