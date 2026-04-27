import { API_BASE } from "@/shared/lib/utils/api.util";

export interface IUploadPayload {
  url: string;
}

export async function uploadImage(
  file: File,
  token: string,
): Promise<IApiResponse<IUploadPayload>> {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  return res.json();
}
