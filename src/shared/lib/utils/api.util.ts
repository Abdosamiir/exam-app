export const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
