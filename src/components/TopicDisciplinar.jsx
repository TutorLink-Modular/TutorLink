import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const TopicDisciplinar = () => {
  const { topicId } = useParams(); // ✅ Detectamos el ID del tema desde la URL
  const location = useLocation(); // ✅ Recuperamos los datos pasados desde la otra página
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ✅ Inicializamos el estado con los datos pasados desde la otra página (si existen)
  const [topic, setTopic] = useState({
    title: location.state?.title || "",
    text: location.state?.text || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Si ya tenemos datos del tema en `location.state`, evitamos hacer la petición
    if (location.state?.title && location.state?.text) {
      return;
    }

    setLoading(true);
    const fetchTopic = async () => {
      try {
        const response = await fetch(`${apiUrl}/topics-disciplinary/topic/${topicId}`);
        if (!response.ok) throw new Error("No se pudo obtener el tema.");

        const data = await response.json();
        setTopic({ title: data.title, text: data.text });
      } catch (error) {
        console.error("❌ Error al obtener el tema:", error);
        setError("No se pudo cargar el tema.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]); // ✅ Se ejecuta cada vez que cambia el `topicId`

  // ✅ Forzar una recarga ligera cambiando la `key` del contenedor
  return (
    <div key={topicId}>
      {loading ? <p>Cargando tema...</p> : error ? <p>{error}</p> : (
        <>
          <h1>{topic.title}</h1>
          <p>{topic.text}</p>
        </>
      )}
    </div>
  );
};

export default TopicDisciplinar;
