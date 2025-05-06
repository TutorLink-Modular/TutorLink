import React from "react";
import "../styles/ModalMessage.css";

const ModalMessage = ({ show, onClose, title, message, actions, type }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container animate__animated animate__fadeInDown">
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="modal-actions">
          {actions.map((action, i) => {
            const isSecond = i === 1;
            const buttonClass = isSecond
              ? `modal-button ${type === "green" ? "green" : type === "red" ? "red" : "confirm"}`
              : "modal-button cancel";

            return (
              <button key={i} className={buttonClass} onClick={action.onClick}>
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;