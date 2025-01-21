import React from "react";
import { Navigate } from "react-router-dom";

// Componente funcional para proteger rutas y redirigir a los usuarios no autenticados
const ProtectedRoute = ({ children }) => {
  // Verifica si el usuario está autenticado revisando si hay un token en localStorage
  const isAuthenticated = !!localStorage.getItem("authToken");

  // Si el usuario no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, renderiza los elementos hijos (children)
  return children;
};

export default ProtectedRoute;
