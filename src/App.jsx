import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CardContainer from "./components/CardContainer";
import OtherPage from "./components/OtherPage"; // Asegúrate de crear este componente

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<CardContainer />} />
          <Route path="/other" element={<OtherPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
