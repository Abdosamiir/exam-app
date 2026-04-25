import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import {
  IDiploma,
  IDiplomasPayload,
  ICreateDiplomaFields,
  IUpdateDiplomaFields,
} from "../types/diploma";

export async function getDiplomas(
  token?: string,
): Promise<IApiResponse<IDiplomasPayload>> {
  const res = await fetch(`${API_BASE}/diplomas`, {
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
  token: string,
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${API_BASE}/diplomas`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDiploma(
  id: string,
  data: IUpdateDiplomaFields,
  token: string,
): Promise<IApiResponse<IDiploma>> {
  const res = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDiploma(
  id: string,
  token: string,
): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}
