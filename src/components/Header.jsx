import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "./Sidebar";
import "../styles/Header.css";
import useAutoLogout from "../hooks/useAutoLogout";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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

  useAutoLogout(30);

  useEffect(() => {
    const expiration = localStorage.getItem("tokenExpiresAt");
    if (expiration && new Date().getTime() > parseInt(expiration)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiresAt");
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <i
            ref={toggleRef}
            className={`fas fa-bars menu-icon ${isSidebarOpen ? "active" : ""}`}
            onClick={toggleSidebar}
            title="📋  Haz clic para abrir/cerrar el sidebar"
          ></i>
          <div
            title="🏠  Haz clic para regresar al home"
            className="logo-container"
            onClick={handleMain}
          >
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
            title="❌ Haz clic para cerrar sesión"
          ></i>
        </div>
      </header>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleRef={toggleRef}
      />
    </>
  );
};

export default Header;
