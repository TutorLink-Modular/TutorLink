import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "./Sidebar";
import "../styles/Header.css";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  const handleMain = () => {
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <i
            className={`fas fa-bars menu-icon ${isSidebarOpen ? "active" : ""}`}
            onClick={toggleSidebar}
            title="📋  Haz clic para abrir/cerrar el sidebar"
          ></i>
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
