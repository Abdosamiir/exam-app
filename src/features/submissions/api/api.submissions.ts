import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import {
  ICreateSubmissionFields,
  ISubmissionsPayload,
  ISubmissionAnalyticsPayload,
  ICreateSubmissionResponsePayload,
} from "../types/submission";

export async function createSubmission(
  data: ICreateSubmissionFields,
  token: string,
): Promise<IApiResponse<ICreateSubmissionResponsePayload>> {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getSubmissions(
  params?: { page?: number; limit?: number },
  token?: string,
): Promise<IApiResponse<ISubmissionsPayload>> {
  const url = new URL(`${API_BASE}/submissions`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
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
