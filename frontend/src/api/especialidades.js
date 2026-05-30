import { apiRequest } from "./http";

export const listarEspecialidades = () => apiRequest("/especialidade");

export const criarEspecialidade = (dados) =>
  apiRequest("/especialidade", { method: "POST", body: dados });

export const deletarEspecialidade = (id) =>
  apiRequest(`/especialidade/${id}`, { method: "DELETE" });
