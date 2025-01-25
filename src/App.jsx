import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import OtherPage from "./components/OtherPage";
import Login from "./components/Login";
import Register from "./components/Register"; // Importamos el componente Register
import ForgotPassword from "./components/ForgotPassword"; // Importamos el componente ForgotPassword
import ResetPassword from "./components/ResetPassword"; // Importamos el componente ResetPassword
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/login" element={<Login />} />
          {/* Ruta pública para el registro */}
          <Route path="/register" element={<Register />} /> {/* Nueva ruta */}
          {/* Ruta pública para recuperación de contraseña */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Ruta pública para restablecimiento de contraseña */}
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <CardContainer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/other"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <OtherPage />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
