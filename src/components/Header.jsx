import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; 
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "./Sidebar";
import "../styles/Header.css";


const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegación

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  //Creamos una funcion cuando el usuario quiera salir de su cuenta, simplemente eliminamos el token 
  //que le permite acceso y recargamos la pagina
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload(); 
  }

  const handleMain = () => { 
      navigate("/");
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <i
            className={`fas fa-bars menu-icon ${isSidebarOpen ? "active" : ""}`}
            onClick={toggleSidebar}
          ></i>
          <div className="header-logo">
            <img src="/logo.svg" alt="TutorLink Logo" className="logo" onClick={handleMain}/>
            <span className="logo-text" onClick={handleMain}>
              Tutor<span className="highlight">Link</span>
            </span>
          </div>
        </div>
        <div className="header-right">
          <i className="fas fa-user-circle user-icon"></i>
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
