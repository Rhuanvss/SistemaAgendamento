const BASE = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro desconhecido");
  }
  return res.status === 204 ? null : res.json();
}

export const listarConsultas = () =>
  fetch(`${BASE}/consulta/listar`).then(handleResponse);

export const buscarConsulta = (id) =>
  fetch(`${BASE}/consulta/${id}`).then(handleResponse);

export const criarConsulta = (dados) =>
  fetch(`${BASE}/consulta/adicionar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then(handleResponse);

export const confirmarConsulta = (id) =>
  fetch(`${BASE}/consulta/${id}/confirmar`, { method: "PATCH" }).then(handleResponse);

export const concluirConsulta = (id) =>
  fetch(`${BASE}/consulta/${id}/concluir`, { method: "PATCH" }).then(handleResponse);

export const cancelarConsulta = (id) =>
  fetch(`${BASE}/consulta/${id}/cancelar`, { method: "PATCH" }).then(handleResponse);

export const deletarConsulta = (id) =>
  fetch(`${BASE}/consulta/${id}`, { method: "DELETE" }).then(handleResponse);