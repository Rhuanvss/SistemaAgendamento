const BASE = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro desconhecido");
  }
  return res.status === 204 ? null : res.json();
}

export const listarEspecialidades = () =>
  fetch(`${BASE}/especialidade`).then(handleResponse);

export const criarEspecialidade = (dados) =>
  fetch(`${BASE}/especialidade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then(handleResponse);

export const deletarEspecialidade = (id) =>
  fetch(`${BASE}/especialidade/${id}`, { method: "DELETE" }).then(handleResponse);