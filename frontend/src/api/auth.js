import { apiRequest, setToken, clearToken, getToken } from "./http";

export async function login(email, senha) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, senha },
    skipAuth: true,
  });
  if (data?.token) {
    setToken(data.token);
  }
  return data;
}

export function logout() {
  clearToken();
}

export function isAuthenticated() {
  return Boolean(getToken());
}
