import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

/**
 * Server-side proxy: forwards client requests to the external API and
 * attaches the bearer token from the (httpOnly) session cookie, so the
 * token never reaches the browser.
 */
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const jwt = await getToken({ req: request });
  const { path } = await params;

  const headers: Record<string, string> = {};
  if (jwt?.token) headers["Authorization"] = `Bearer ${jwt.token}`;

  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const res = await fetch(
    `${API_URL}/${path.join("/")}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    },
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
};
