import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import "./styles/global.css";

import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import AssignmentPage from "./pages/Technician/AssignmentPage";
import UpdateAssigment from "./pages/Technician/UpdateAssigment";
import ManagerAssignmentPage from "./pages/Manage/ManagerAssignmentPage";
import AssignUser from "./pages/Manage/AssignUser";
import CreateAssigment from "./pages/default/CreateAssigment";
import Dashboard from "./pages/dashboard/Dashboard";
import Facelities from "./pages/dashboard/Facelies";
import Progress from "./pages/Manage/Progress";
import WorkersManagement from "./pages/dashboard/WorkersManagement";
import Login from "./pages/Login";

import echo from "./services/echo";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = echo.channel("notifications");

    channel.subscribed(() => {
      console.log("Subscribed to notifications channel!");
    });

    channel.listen(".MessageNotification", (e) => {
      console.log("Broadcast received:", e);
    });

    return () => {
      echo.leave("notifications");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/technician/assignments" element={<AssignmentPage />} />
        <Route path="/manage/assignments" element={<ManagerAssignmentPage />} />
        <Route path="/assign/:id" element={<AssignUser />} />
        <Route path="/progress/:id" element={<Progress />} />
        <Route path="/createAssigment" element={<CreateAssigment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/facelities" element={<Facelities />} />
        <Route
          path="/dashboard/workersManagement"
          element={<WorkersManagement />}
        />
        <Route path="/UpdateAssigment/:id" element={<UpdateAssigment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
