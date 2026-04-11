import { IUser } from "./user";

declare module "next-auth" {
  /**
 * The shape of the user object returned in the OAuth providers' `profile` callback,
 * or the second parameter of the `session` callback, when using a database.
 */
  interface User {
    user: IUser;
    token: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: IUser;
    token: string;
  }
}