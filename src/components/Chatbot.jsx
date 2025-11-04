import React, { useState, useRef, useEffect } from "react";
import "../styles/Chatbot.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; //Cargar FontAwesome para iconos

const GOOGLE_AI_KEY = import.meta.env.VITE_GOOGLEAI_API_KEY;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hola! Soy tu IA tutor para ayudarte en lo que necesites. Pregúntame lo que quieras!",
      sender: "bot",
    },
    {
      text: "Ejemplos para preguntar a la IA de manera efectiva: \n🧠 ¿Qué significa (concepto) en [materia]? \n📊 Explícame (concepto) con un ejemplo",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError(null);
    setIsLoading(true);

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent?key=${GOOGLE_AI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `Responde lo siguiente en español: ${input}` }],
              },
            ], //Puedes añadir texto al prompt que envia el usuario
          }),
        }
      );
      const data = await response.json();
      const botResponse =
        data.candidates[0].content.parts[0].text || "No entendí la pregunta.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    } catch (error) {
      setError(error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error al obtener respuesta.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <button
        className="chatbot-toggle"
        onClick={toggleChat}
        title="💡 Haz clic para abrir/cerrar el chatbot y resolver tus dudas"
      >
        <i
          className={`fas ${
            isOpen ? "fa-times bubleX-iconChat" : "fa-robot bubleBot-iconChat"
          }`}
        ></i>
      </button>
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <i
                  className={`chat-avatar ${
                    msg.sender === "user"
                      ? "fas fa-user-circle user-iconChat"
                      : "fas fa-robot bot-iconChat"
                  }`}
                ></i>
                <span>{msg.text}</span>
              </div>
            ))}
            {isLoading && <div className="message bot">Cargando...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              onKeyDown={handleKeyPress}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
