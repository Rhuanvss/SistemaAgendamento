import { apiRequest } from "./http";

export const listarProntuarios = () => apiRequest("/prontuario/listar");

export const buscarProntuario = (id) => apiRequest(`/prontuario/${id}`);

export const criarProntuario = (dados) =>
  apiRequest("/prontuario/adicionar", { method: "POST", body: dados });

export const deletarProntuario = (id) =>
  apiRequest(`/prontuario/${id}`, { method: "DELETE" });
