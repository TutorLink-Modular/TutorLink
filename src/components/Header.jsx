import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "./Sidebar";
import "../styles/Header.css";
import useAutoLogout from "../hooks/useAutoLogout"; //Libreria para eliminar el token a los 15 min de inactividad

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiresAt");
    window.location.reload();
  };

  const handleMain = () => {
    navigate("/");
  };

  useAutoLogout(30); // 30 minutos de inactividad

  useEffect(() => {
    const expiration = localStorage.getItem("tokenExpiresAt");
    if (expiration && new Date().getTime() > parseInt(expiration)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiresAt");
      window.location.href = "/login"; // o navigate("/login") si estás dentro de un componente
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <i
            className={`fas fa-bars menu-icon ${isSidebarOpen ? "active" : ""}`}
            onClick={toggleSidebar}
            title="📋  Haz clic para abrir/cerrar el sidebar"
          ></i>
          {/* Logo y Texto con evento de clic para redirigir a la página principal */}
          <div title="🏠  Haz clic para regresar al home" className="logo-container" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="TutorLink Logo" className="logo" />
            <span className="logo-text">
              Tutor<span className="highlight">Link</span>
            </span>
          </div>
        </div>
        <div className="header-right">
          <i
            className="fas fa-user-circle user-icon"
            onClick={() => navigate("/profile")}
            title="👤  Haz clic para abrir perfil"
          ></i>
          <i
            className="fas fa-sign-out-alt logout-icon"
            onClick={handleLogout}
            title="❌ Haz clic para cerrar sesion"
          ></i>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
