import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import { IUser } from "@/features/auth/types/user";

export async function seedDatabase(): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/admin/seed`, {
    method: "POST",
    headers: authHeaders(),
  });
  return res.json();
}

export async function toggleUserImmutable(
  id: string,
): Promise<IApiResponse<IUser>> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/immutable`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return res.json();
}
