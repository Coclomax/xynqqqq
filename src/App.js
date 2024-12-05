import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import Check from "./Check";
import Texwork from "./Texwork";
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassedCheck, setHasPassedCheck] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Router>
      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Check setHasPassedCheck={setHasPassedCheck} />} />
          <Route path="/m" element={hasPassedCheck ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/tex" element={<Texwork />} />
          <Route path="/app" element={<HomePage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;