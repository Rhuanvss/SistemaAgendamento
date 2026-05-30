import { apiRequest } from "./http";

export const listarPacientes = () => apiRequest("/paciente/listar");

export const buscarPaciente = (id) => apiRequest(`/paciente/${id}`);

export const criarPaciente = (dados) =>
  apiRequest("/paciente/adicionar", { method: "POST", body: dados });

export const deletarPaciente = (id) =>
  apiRequest(`/paciente/${id}`, { method: "DELETE" });
