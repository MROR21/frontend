import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from './store/useAppStore';
import { Login } from "./pages/Login";
import { Tasks } from "./pages/Tasks";

const ProtectedRoute = ({ children }) => {
  const token = useAppStore((state) => state.token); 
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children; 
};

function App() {
  const token = useAppStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/tasks" replace />}
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/tasks" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;