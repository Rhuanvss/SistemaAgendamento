import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Consultas from "./pages/Consultas";
import Medicos from "./pages/Medicos";
import Pacientes from "./pages/Pacientes";
import Especialidades from "./pages/Especialidades";
import Prontuarios from "./pages/Prontuarios";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}