import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import {
  IDiploma,
  IDiplomasPayload,
  ICreateDiplomaFields,
  IUpdateDiplomaFields,
} from "../types/diploma";

export async function getDiplomas(
  params?: { page?: number; limit?: number; search?: string },
  token?: string,
): Promise<IApiResponse<IDiplomasPayload>> {
  const query = new URLSearchParams();
  query.set("page", String(params?.page ?? 1));
  query.set("limit", String(params?.limit ?? 6));
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`${API_BASE}/diplomas?${query.toString()}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function getDiplomaById(
  id: string,
  token?: string,
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${API_BASE}/diplomas/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function createDiploma(
  data: ICreateDiplomaFields,
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${API_BASE}/diplomas`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDiploma(
  id: string,
  data: IUpdateDiplomaFields,
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDiploma(id: string): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function toggleDiplomaImmutable(
  id: string,
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${API_BASE}/admin/diplomas/${id}/immutable`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}
