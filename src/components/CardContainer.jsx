import React from "react";
import Card from "./Card";
import "../styles/CardContainer.css";

const images = import.meta.glob('../assets/images/*.png', {
  eager: true,
  import: 'default',
});

// Función para obtener la URL de imagen a partir del nombre
const getImageUrl = (imageName) => {
  const match = Object.entries(images).find(([path]) =>
    path.endsWith(imageName)
  );
  return match ? match[1] : null;
};

const CardContainer = () => {
  const cardsData = [
    {
      title: "Tutoría Disciplinar",
      subtitle: "¿Qué es?",
      description:
        "Se refiere a la orientación y el acompañamiento que se realiza para gestionar el comportamiento y la disciplina de los estudiantes en el ámbito escolar. El tutor o tutora no sólo se enfoca en el rendimiento académico, sino también en ayudar a los estudiantes a desarrollar actitudes positivas, responsabilidades, respeto por las normas y una conducta adecuada dentro del contexto escolar.",
        imageName: "disciplinar.png",
    },
    {
      title: "Tutoría de Orientación",
      subtitle: "¿Qué es?",
      description:
        "Se enfoca más en el desarrollo personal, social y emocional del estudiante. El tutor o tutora ofrece apoyo en aspectos como la toma de decisiones y la organización de la vida académica y personal, así como la orientación vocacional. Este tipo de tutoría también aborda aspectos relacionados con la autoestima, las relaciones interpersonales y el bienestar general del estudiante.",
        imageName: "orientacion.png",
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
          imageUrl={getImageUrl(card.imageName)}
        />
      ))}
    </div>
  );
};

export default CardContainer;
