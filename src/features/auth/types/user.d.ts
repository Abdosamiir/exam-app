import { USER_ROLES } from "../constants/user.constant";

export type TRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: TRole;
  createdAt: string;
  updatedAt: string;
}
