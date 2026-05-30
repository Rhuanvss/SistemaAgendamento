import { apiRequest } from "./http";

export const listarConsultas = () => apiRequest("/consulta/listar");

export const buscarConsulta = (id) => apiRequest(`/consulta/${id}`);

export const criarConsulta = (dados) =>
  apiRequest("/consulta/adicionar", { method: "POST", body: dados });

export const confirmarConsulta = (id) =>
  apiRequest(`/consulta/${id}/confirmar`, { method: "PATCH" });

export const concluirConsulta = (id) =>
  apiRequest(`/consulta/${id}/concluir`, { method: "PATCH" });

export const cancelarConsulta = (id) =>
  apiRequest(`/consulta/${id}/cancelar`, { method: "PATCH" });

export const deletarConsulta = (id) =>
  apiRequest(`/consulta/${id}`, { method: "DELETE" });
