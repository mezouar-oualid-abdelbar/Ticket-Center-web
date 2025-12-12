import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./styles/global.css";
// import './App.css'
import "./styles/global.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AssignmentPage from "./pages/Technician/AssignmentPage";
import ManagerAssignmentPage from "./pages/Manage/ManagerAssignmentPage";
import AssignUser from "./pages/Manage/AssignUser";
import CreateAssigment from "./pages/default/CreateAssigment";
import Dashboard from "./pages/dashboard/Dashboard";
import Facelities from "./pages/dashboard/Facelies";
import WorkersManagement from "./pages/dashboard/WorkersManagement";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="route-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/technician/assignments"
              element={<AssignmentPage />}
            />
            <Route
              path="/manage/assignments"
              element={<ManagerAssignmentPage />}
            />
            <Route path="/assign/:id" element={<AssignUser />} />
            <Route path="/createAssigment" element={<CreateAssigment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/facelities" element={<Facelities />} />
            <Route
              path="/dashboard/workersManagement"
              element={<WorkersManagement />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
