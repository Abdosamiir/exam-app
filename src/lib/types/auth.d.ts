import { IUser } from "./user";

export interface ILoginFields {
  username: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IUpdateProfileFields {
  firstName: string;
  lastName: string;
}

export type IUpdateProfileResponse = IUser