import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import { IAuditLogsPayload } from "../types/audit-log";

export async function getAuditLogs(
  token?: string,
  page: number = 1,
  limit: number = 12,
): Promise<IApiResponse<IAuditLogsPayload>> {
  const res = await fetch(
    `${API_BASE}/admin/audit-logs?page=${page}&limit=${limit}`,
    { headers: authHeaders(token), cache: "no-store" },
  );
  return res.json();
}

export async function deleteAuditLog(
  id: string,
  token: string,
): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/admin/audit-logs/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}

export async function deleteAllAuditLogs(
  token: string,
): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}
