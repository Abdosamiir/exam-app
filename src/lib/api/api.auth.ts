import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ILoginResponse } from "@/lib/types/auth";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        /*
          Return <false>: Login failed
          Throw <error>: Login failed
          Return <{ id, ...user? }>: Login successful
        */

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data: IApiResponse<ILoginResponse> = await response.json();

        if (!data.status) {
          throw new Error(data.message);
        }

        const loginData = data.payload!;

        return {
          id: loginData.user.id,
          token: loginData.token,
          user: loginData.user,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }

      if (trigger === "update" && session) {
        token.user = session.user;
        token.token = session.accessToken;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user;

      return session;
    },
  },
  // secret: process.env.NEXTAUTH_SECRET
};
