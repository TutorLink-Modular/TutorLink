import React, { useState, useRef, useEffect } from "react";
import "../styles/Chatbot.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; //Cargar FontAwesome para iconos

const GOOGLE_AI_KEY = import.meta.env.VITE_GOOGLEAI_API_KEY;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hola! Soy tu AI tutor para ayudarte en lo que necesites. Pregúntame lo que quieras!",
      sender: "bot",
    },
    {
      text: "Ejemplos para preguntar a la AI de manera efectiva: \n🧠 ¿Qué significa (concepto) en [materia]? \n📊 Explícame (concepto) con un ejemplo",
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

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    const systemPrompt = "Eres un tutor académico virtual. Responde siempre en español, de forma clara, educativa y breve.";
    
    const history = newMessages
        .slice(2)
        .map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
        }));
        
    let contentsToSend = [];
    
    // A) Si es la PRIMERA pregunta (history solo contiene el mensaje actual del usuario)
    if (history.length === 1 && history[0].role === 'user') {
        // Combinamos la personalidad y la pregunta del usuario en el primer (y único) mensaje.
        contentsToSend = [
            {
                role: "user",
                parts: [{ text: systemPrompt + "\n\n" + history[0].parts[0].text }],
            }
        ];
    } 
    // B) Si ya hay un historial de conversación (múltiples preguntas/respuestas)
    else {
        // En este caso, el primer mensaje del historial (la primera pregunta real)
        // debe tener la instrucción del sistema adjunta para mantener la personalidad.
        
        // Adjuntamos el systemPrompt a la primera pregunta real de la conversación
        history[0].parts[0].text = systemPrompt + "\n\n" + history[0].parts[0].text;
        
        // Enviamos todo el historial ya corregido.
        contentsToSend = history;
    }


    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GOOGLEAI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: contentsToSend, 
                }),
            }
        );

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error("Error de API:", errorData);
            throw new Error(`Error ${geminiResponse.status}: ${errorData?.error?.message || 'Error desconocido'}`);
        }

        const data = await geminiResponse.json();

        const botResponse =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No entendí la pregunta o hubo un error al procesar la respuesta.";

        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setMessages((prev) => [
            ...prev,
            { text: `Error al obtener respuesta de Gemini: ${error.message}`, sender: "bot" },
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
