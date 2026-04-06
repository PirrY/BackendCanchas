import * as SecureStore from "expo-secure-store";
import axios from "axios";

const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

async function getAuthHeaders(
  withAuth: boolean,
): Promise<Record<string, string>> {
  if (!withAuth) return {};
  const token = await SecureStore.getItemAsync("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const apiClient = {
  get: async <T>(endpoint: string, withAuth: boolean): Promise<T> => {
    const headers = await getAuthHeaders(withAuth);
    const { data } = await http.get<T>(endpoint, { headers });
    return data;
  },

  post: async <T, B = unknown>(
    endpoint: string,
    body: B,
    withAuth: boolean,
  ): Promise<T> => {
    const headers = await getAuthHeaders(withAuth);
    const { data } = await http.post<T>(endpoint, body, { headers });
    return data;
  },

  put: async <T, B = unknown>(
    endpoint: string,
    body: B,
    withAuth: boolean,
  ): Promise<T> => {
    const headers = await getAuthHeaders(withAuth);
    const { data } = await http.put<T>(endpoint, body, { headers });
    return data;
  },

  delete: async <T>(endpoint: string, withAuth: boolean): Promise<T> => {
    const headers = await getAuthHeaders(withAuth);
    const { data } = await http.delete<T>(endpoint, { headers });
    return data;
  },
};
