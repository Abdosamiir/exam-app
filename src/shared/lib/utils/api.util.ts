/**
 * On the server (SSR prefetch) we call the external API directly and pass the
 * token read from the session cookie. In the browser every request goes
 * through the /api/proxy route handler, which attaches the bearer token
 * server-side — the client never holds it.
 */
export const API_BASE =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL as string)
    : "/api/proxy";

export function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
