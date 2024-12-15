import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import OtherPage from "./components/OtherPage"; // Asegúrate de crear este componente
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Login />
      </div>
    </Router>
  );
}

export default App;
