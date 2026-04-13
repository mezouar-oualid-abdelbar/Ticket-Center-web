import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./features/auth/pages/Login";
import HomePage from "./features/default/pages/HomePage";
import Ticket from "./features/manager/pages/Tickets";
import CreateAssignment from "./features/manager/pages/CreateAssigment";
import CreateTicket from "./features/default/pages/CreateTicket";
import Progress from "./features/manager/pages/Progress";
import NotFound from "./features/default/pages/Notfound";
import Assignments from "./features/Technician/pages/Assignments";
import Assigment from "./features/Technician/pages/Assigment";
import Unauthorized from "./features/default/pages/unauthorized";

export default function App() {
  return (
    <Routes>
      {/* Public */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/404" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* Protected */}

      {/* default */}

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/createTicket" element={<CreateTicket />} />
      </Route>

      {/* manager */}

      <Route element={<ProtectedRoute roles={["manager", "admin"]} />}>
        <Route path="/manager/tickets" element={<Ticket />} />
      </Route>

      <Route element={<ProtectedRoute roles={["manager", "admin"]} />}>
        <Route path="/assign/:id" element={<CreateAssignment />} />
      </Route>

      <Route element={<ProtectedRoute roles={["manager", "admin"]} />}>
        <Route path="/progress/:id" element={<Progress />} />
      </Route>

      {/* technician*/}

      <Route element={<ProtectedRoute />}>
        <Route path="/technician/assignments" element={<Assignments />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/technician/assignment/:id" element={<Assigment />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
