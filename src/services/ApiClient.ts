import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

async function request<T>(
  method: string,
  endpoint: string,
  withAuth: boolean,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (withAuth) {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let data: unknown = {};
    try {
      data = await res.json();
    } catch {
      // respuesta sin cuerpo
    }
    const err: any = new Error(`HTTP ${res.status}`);
    err.response = { data };
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, withAuth: boolean) =>
    request<T>("GET", endpoint, withAuth),

  post: <T, B = unknown>(endpoint: string, body: B, withAuth: boolean) =>
    request<T>("POST", endpoint, withAuth, body),

  put: <T, B = unknown>(endpoint: string, body: B, withAuth: boolean) =>
    request<T>("PUT", endpoint, withAuth, body),

  delete: <T>(endpoint: string, withAuth: boolean) =>
    request<T>("DELETE", endpoint, withAuth),
};
