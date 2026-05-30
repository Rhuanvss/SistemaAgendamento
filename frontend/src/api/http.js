const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080/api";
const TOKEN_KEY = "authToken";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    skipAuth = false,
  } = options;

  const finalHeaders = { ...headers };
  let finalBody = body;

  if (finalBody !== undefined && !(finalBody instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(finalBody);
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  if (!res.ok) {
    let message;
    try {
      const err = await res.json();
      message = err?.message;
    } catch {
      message = undefined;
    }

    if (!message) {
      if (res.status === 401 || res.status === 403) {
        message = "Nao autorizado. Faca login.";
      } else {
        message = `Erro ${res.status}`;
      }
    }

    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
