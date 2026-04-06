import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from './store/useAppStore';
import { Login } from "./pages/Login";
import { Tasks } from "./pages/Tasks";

  const PublicRoute = ({ children }) => {
  const token = useAppStore((state) => state.token);
  return !token ? children : <Navigate to="/tasks" replace />;
  };

  const ProtectedRoute = ({ children }) => {
  const token = useAppStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
  };

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;