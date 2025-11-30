import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./styles/global.css";
// import './App.css'
import "./styles/global.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OpenTicketPage from "./pages/OpenTicketPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import AssignTicketPage from "./pages/AssignTicketPage";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="route-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/open-ticket" element={<OpenTicketPage />} />
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/ticket/:id" element={<TicketDetailPage />} />
            <Route path="/assign-ticket" element={<AssignTicketPage />} />
            <Route path="/technician" element={<TechnicianDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
