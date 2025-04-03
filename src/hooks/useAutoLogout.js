import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeoutMinutes = 15) => {
  const navigate = useNavigate();
  const timer = useRef(null);

  const clearAuth = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(clearAuth, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // iniciar temporizador al cargar

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timer.current);
    };
  }, []);
};

export default useAutoLogout;