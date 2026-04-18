import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./features/auth/ProtectedRoute";

// Auth pages
import LoginPage from "./features/auth/pages/Login";
import RegisterPage from "./features/auth/pages/Register";
import ForgotPasswordPage from "./features/auth/pages/ForgotPassword";
import ResetPasswordPage from "./features/auth/pages/ResetPassword";

// Default pages
import HomePage from "./features/default/pages/HomePage";
import CreateTicket from "./features/default/pages/CreateTicket";
import NotFound from "./features/default/pages/NotFound";
import Unauthorized from "./features/default/pages/Unauthorized";

// Manager pages
import Ticket from "./features/manager/pages/Tickets";
import CreateAssignment from "./features/manager/pages/CreateAssigment";
import Progress from "./features/manager/pages/Progress";

// Technician pages
import Assignments from "./features/Technician/pages/Assignments";
import Assigment from "./features/Technician/pages/Assigment";

export default function App() {
  return (
    <Routes>
      {/* ── Public ────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Protected: all authenticated users ───── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/createTicket" element={<CreateTicket />} />
        <Route path="/technician/assignments" element={<Assignments />} />
        <Route path="/technician/assignment/:id" element={<Assigment />} />
      </Route>

      {/* ── Protected: manager / admin ────────────── */}
      <Route element={<ProtectedRoute roles={["manager", "admin"]} />}>
        <Route path="/manager/tickets" element={<Ticket />} />
        <Route path="/assign/:id" element={<CreateAssignment />} />
        <Route path="/progress/:id" element={<Progress />} />
      </Route>

      {/* ── Fallback ──────────────────────────────── */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
