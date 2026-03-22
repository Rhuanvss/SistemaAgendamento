const BASE = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro desconhecido");
  }
  return res.status === 204 ? null : res.json();
}

export const listarPacientes = () =>
  fetch(`${BASE}/paciente/listar`).then(handleResponse);

export const buscarPaciente = (id) =>
  fetch(`${BASE}/paciente/${id}`).then(handleResponse);

export const criarPaciente = (dados) =>
  fetch(`${BASE}/paciente/adicionar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then(handleResponse);

export const deletarPaciente = (id) =>
  fetch(`${BASE}/paciente/${id}`, { method: "DELETE" }).then(handleResponse);