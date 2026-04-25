import {
  IProfilePayload,
  IUpdateProfileFields,
  IChangePasswordFields,
} from "../types/user";

const BASE = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getProfile(
  token: string
): Promise<IApiResponse<IProfilePayload>> {
  const res = await fetch(`${BASE}/users/profile`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function updateProfile(
  data: IUpdateProfileFields,
  token: string
): Promise<IApiResponse<IProfilePayload>> {
  const res = await fetch(`${BASE}/users/profile`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function changePassword(
  data: IChangePasswordFields,
  token: string
): Promise<IApiResponse<null>> {
  const res = await fetch(`${BASE}/users/change-password`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function requestEmailChange(
  newEmail: string,
  token: string
): Promise<IApiResponse<null>> {
  const res = await fetch(`${BASE}/users/email/request`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ newEmail }),
  });
  return res.json();
}

export async function confirmEmailChange(
  code: string,
  token: string
): Promise<IApiResponse<null>> {
  const res = await fetch(`${BASE}/users/email/confirm`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ code }),
  });
  return res.json();
}

export async function deleteAccount(
  token: string
): Promise<IApiResponse<null>> {
  const res = await fetch(`${BASE}/users/account`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}
