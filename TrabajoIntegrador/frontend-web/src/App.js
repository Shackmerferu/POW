import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Convenios from "./pages/convenios/convenios";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/convenios" element={<Convenios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;