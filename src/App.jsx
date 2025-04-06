import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import TutoriaDisciplinar from "./components/TutoriaDisciplinar";
import TutoriaOrientacional from "./components/TutoriaOrientacional";
import TopicOrientacional from "./components/TopicOrientacional";
import TopicDisciplinar from "./components/TopicDisciplinar";
import TopicsByMainTopic from "./components/TopicsByMainTopic";
import Chatbot from "./components/Chatbot";

// ✅ Nuevos componentes
import ManageTopics from "./components/ManageTopics";
import TopicFormPage from "./components/TopicFormPage"; //Este es el que muestra el formulario con datos

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rutas Protegidas */}
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

          {/* Tutoría Disciplinar */}
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
            path="/tutoria-disciplinar/main-topic/:idMainTopic"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TopicsByMainTopic />
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

          {/* Tutoría Orientacional */}
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

          {/* Manejo de temas */}
          <Route
            path="/manejo-temas"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <ManageTopics />
                  <Chatbot />
                </>
              </ProtectedRoute>
            }
          />

          {/* 🆕 Ruta para editar temas */}
          <Route
            path="/manejo-temas/edit/:tipo/:id"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TopicFormPage />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manejo-temas/nuevo/:tipo"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TopicFormPage />
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
