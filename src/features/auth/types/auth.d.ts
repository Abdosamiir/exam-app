import z from "zod";
import { IUser } from "../../../features/auth/types/user";
import { loginSchema } from "../schemas/auth.schema";

// export interface ILoginFields {
//   username: string;
//   password: string;
// }

export type LoginFields = z.infer<typeof loginSchema>;

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IUpdateProfileFields {
  firstName: string;
  lastName: string;
}

export type IUpdateProfileResponse = IUser;
