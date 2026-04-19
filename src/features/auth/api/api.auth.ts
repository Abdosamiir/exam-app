import "server-only";
import { ILoginResponse, LoginFields } from "../types/auth";

export const login = async (loginfields: LoginFields) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(loginfields),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const payload: IApiResponse<ILoginResponse> = await response.json();

  return payload;
};
