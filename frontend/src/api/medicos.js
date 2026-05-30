import { apiRequest } from "./http";

export const listarMedicos = () => apiRequest("/medico/listar");

export const criarMedico = (dados) =>
  apiRequest("/medico/adicionar", { method: "POST", body: dados });

export const adicionarEspecialidade = (medicoId, especialidadeId) =>
  apiRequest(`/medico/${medicoId}/especialidade`, {
    method: "POST",
    body: { especialidadeId },
  });

export const deletarMedico = (id) =>
  apiRequest(`/medico/${id}`, { method: "DELETE" });
