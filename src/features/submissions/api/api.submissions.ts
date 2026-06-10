import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import {
  ICreateSubmissionFields,
  ISubmissionsPayload,
  ISubmissionAnalyticsPayload,
  ICreateSubmissionResponsePayload,
} from "../types/submission";

export async function createSubmission(
  data: ICreateSubmissionFields,
): Promise<IApiResponse<ICreateSubmissionResponsePayload>> {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getSubmissions(
  params?: { page?: number; limit?: number },
  token?: string,
): Promise<IApiResponse<ISubmissionsPayload>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const res = await fetch(`${API_BASE}/submissions?${query.toString()}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function getSubmissionById(
  id: string,
  token?: string,
): Promise<IApiResponse<ISubmissionAnalyticsPayload>> {
  const res = await fetch(`${API_BASE}/submissions/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}
