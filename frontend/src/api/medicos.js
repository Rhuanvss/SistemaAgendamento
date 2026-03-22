const BASE = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro desconhecido");
  }
  return res.status === 204 ? null : res.json();
}

export const listarMedicos = () =>
  fetch(`${BASE}/medico/listar`).then(handleResponse);

export const criarMedico = (dados) =>
  fetch(`${BASE}/medico/adicionar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then(handleResponse);

export const adicionarEspecialidade = (medicoId, especialidadeId) =>
  fetch(`${BASE}/medico/${medicoId}/especialidade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ especialidadeId }),
  }).then(handleResponse);

export const deletarMedico = (id) =>
  fetch(`${BASE}/medico/${id}`, { method: "DELETE" }).then(handleResponse);