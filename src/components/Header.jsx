import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <i className="fas fa-bars menu-icon"></i>
        <img src="/logo.svg" alt="TutorLink Logo" className="logo" />
        <span className="logo-text">
          Tutor<span className="highlight">Link</span>
        </span>
      </div>
      <div className="header-right">
        <i className="fas fa-user-circle user-icon"></i>
        <i className="fas fa-sign-out-alt logout-icon"></i>
      </div>
    </header>
  );
};

export default Header;
