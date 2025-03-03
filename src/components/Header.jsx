import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar para navegación
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "./Sidebar";
import "../styles/Header.css";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <i
            className={`fas fa-bars menu-icon ${isSidebarOpen ? "active" : ""}`}
            onClick={toggleSidebar}
          ></i>

          {/* Logo y Texto con evento de clic para redirigir a la página principal */}
          <div className="logo-container" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="TutorLink Logo" className="logo" />
            <span className="logo-text">
              Tutor<span className="highlight">Link</span>
            </span>
          </div>
        </div>
        <div className="header-right">
          <i
            className="fas fa-user-circle user-icon"
            onClick={() => navigate("/profile")} // Redirigir al perfil
          ></i>
          <i
            className="fas fa-sign-out-alt logout-icon"
            onClick={handleLogout}
          ></i>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
