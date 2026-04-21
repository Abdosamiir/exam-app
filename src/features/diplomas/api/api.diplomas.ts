import { IDiploma, IDiplomasPayload, ICreateDiplomaFields, IUpdateDiplomaFields } from "../types/diploma";

const BASE = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getDiplomas(token?: string): Promise<IApiResponse<IDiplomasPayload>> {
  const res = await fetch(`${BASE}/diplomas`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function getDiplomaById(
  id: string,
  token?: string
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${BASE}/diplomas/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function createDiploma(
  data: ICreateDiplomaFields,
  token: string
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${BASE}/diplomas`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDiploma(
  id: string,
  data: IUpdateDiplomaFields,
  token: string
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${BASE}/diplomas/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDiploma(
  id: string,
  token: string
): Promise<IApiResponse<null>> {
  const res = await fetch(`${BASE}/diplomas/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}
