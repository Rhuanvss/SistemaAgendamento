import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Consultas from "./pages/Consultas";
import Medicos from "./pages/Medicos";
import Pacientes from "./pages/Pacientes";
import Especialidades from "./pages/Especialidades";
import Prontuarios from "./pages/Prontuarios";
import Login from "./pages/Login";
import { isAuthenticated } from "./api/auth";

export default function App() {
  const authenticated = isAuthenticated();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/consultas" replace /> : <Login />}
        />
        <Route
          path="/*"
          element={
            authenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/consultas" replace />} />
                  <Route path="/consultas" element={<Consultas />} />
                  <Route path="/medicos" element={<Medicos />} />
                  <Route path="/pacientes" element={<Pacientes />} />
                  <Route path="/especialidades" element={<Especialidades />} />
                  <Route path="/prontuarios" element={<Prontuarios />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
