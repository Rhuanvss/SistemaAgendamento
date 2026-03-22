const BASE = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro desconhecido");
  }
  return res.status === 204 ? null : res.json();
}

export const listarProntuarios = () =>
  fetch(`${BASE}/prontuario/listar`).then(handleResponse);

export const buscarProntuario = (id) =>
  fetch(`${BASE}/prontuario/${id}`).then(handleResponse);

export const criarProntuario = (dados) =>
  fetch(`${BASE}/prontuario/adicionar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then(handleResponse);

export const deletarProntuario = (id) =>
  fetch(`${BASE}/prontuario/${id}`, { method: "DELETE" }).then(handleResponse);