import { IUser } from "@/features/auth/types/user";

export type { IUser };

export interface IProfilePayload {
  user: IUser;
}

export interface IUpdateProfileFields {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  phone?: string;
}

export interface IChangePasswordFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
