import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiresAcademic = false }) => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail"); // asegúrate de guardarlo al iniciar sesión

  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiresAcademic && (!email || !email.includes("@academicos"))) {
    return <Navigate to="/" />; // o alguna ruta de error/acceso denegado
  }

  return children;
};

export default ProtectedRoute;
