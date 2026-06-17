import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import { IAuditLogDetailPayload, IAuditLogsPayload } from "../types/audit-log";

export async function getAuditLogs(
  params?: { page?: number; limit?: number },
  token?: string,
): Promise<IApiResponse<IAuditLogsPayload>> {
  const query = new URLSearchParams();
  query.set("page", String(params?.page ?? 1));
  query.set("limit", String(params?.limit ?? 12));

  const res = await fetch(`${API_BASE}/admin/audit-logs?${query.toString()}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function getAuditLogById(
  id: string,
  token?: string,
): Promise<IApiResponse<IAuditLogDetailPayload>> {
  const res = await fetch(`${API_BASE}/admin/audit-logs/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function deleteAuditLog(id: string): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/admin/audit-logs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function deleteAllAuditLogs(): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}
