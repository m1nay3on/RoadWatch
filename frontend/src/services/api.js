const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, { method = "GET", body, authenticated = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("token");
  if (authenticated && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "The request could not be completed.");
  }

  return result;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, authenticated = true) => request(path, { method: "POST", body, authenticated }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
};