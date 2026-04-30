import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import {
  IExam,
  IExamsPayload,
  IExamDetailPayload,
  ICreateExamFields,
  IUpdateExamFields,
} from "../types/exam";

export async function getExams(
  params?: { diplomaId?: string; page?: number; limit?: number },
  token?: string,
): Promise<IApiResponse<IExamsPayload>> {
  const url = new URL(`${API_BASE}/exams`);
  if (params?.diplomaId) url.searchParams.set("diplomaId", params.diplomaId);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function createExam(
  data: ICreateExamFields,
  token: string,
): Promise<IApiResponse<IExam>> {
  const res = await fetch(`${API_BASE}/exams`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateExam(
  id: string,
  data: IUpdateExamFields,
  token: string,
): Promise<IApiResponse<IExam>> {
  const res = await fetch(`${API_BASE}/exams/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteExam(
  id: string,
  token: string,
): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/exams/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}

export async function getExamById(
  id: string,
  token?: string,
): Promise<IApiResponse<IExamDetailPayload>> {
  const res = await fetch(`${API_BASE}/exams/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function toggleExamImmutable(
  id: string,
  token: string,
): Promise<IApiResponse<IExam>> {
  const res = await fetch(`${API_BASE}/admin/exams/${id}/immutable`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  return res.json();
}
