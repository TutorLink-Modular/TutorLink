import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import OtherPage from "./components/OtherPage";
import Login from "./components/Login";
import Register from "./components/Register"; // Importamos el componente Register
import ProtectedRoute from "./components/ProtectedRoute";
import TutoriaDisciplinar from "./components/TutoriaDisciplinar";
import TutoriaOrientacion from "./components/TutoriaOrientacion";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/login" element={<Login />} />
          {/* Ruta pública para el registro */}
          <Route path="/register" element={<Register />} /> {/* Nueva ruta */}
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
            path="/TutoriaDisciplinar"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TutoriaDisciplinar />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/TutoriaOrientacion"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TutoriaOrientacion />
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
