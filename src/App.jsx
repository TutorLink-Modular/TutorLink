import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import Login from "./components/Login";
import Register from "./components/Register"; // Importamos el componente Register
import ForgotPassword from "./components/ForgotPassword"; // Importamos el componente ForgotPassword
import ResetPassword from "./components/ResetPassword"; // Importamos el componente ResetPassword
import Profile from "./components/Profile"; // Importamos el componente Profile
import ProtectedRoute from "./components/ProtectedRoute";
import TutoriaDisciplinar from "./components/TutoriaDisciplinar";
import TutoriaOrientacional from "./components/TutoriaOrientacional";
import TopicOrientacional from "./components/TopicOrientacional";
import TopicDisciplinar from "./components/TopicDisciplinar";
import Chatbot from "./components/Chatbot";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/login" element={<Login />} />
          {/* Ruta pública para el registro */}
          <Route path="/register" element={<Register />} />
          {/* Ruta pública para recuperación de contraseña */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Ruta pública para restablecimiento de contraseña */}
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Ruta protegida para el perfil */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Profile />
                  <Chatbot />
                </>
              </ProtectedRoute>
            }
          />
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <CardContainer />
                  <Chatbot />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutoria-disciplinar"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TutoriaDisciplinar />
                  <Chatbot />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutoria-disciplinar/topic/:topicId"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TopicDisciplinar />
                  <Chatbot />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutoria-orientacional"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TutoriaOrientacional />
                  <Chatbot />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutoria-orientacional/topic/:topicId"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TopicOrientacional />
                  <Chatbot />
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
