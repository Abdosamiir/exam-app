import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { login } from "@/features/auth/api/api.auth";


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
        const result = loginSchema.safeParse({
          username: credentials?.username,
          password: credentials?.password,
        });
        if (!result.success) throw new Error("Invalid username or password.");

        const data = await login(result.data);

        if (!data.status || !data.payload) throw new Error(data.message);

        return {
          id: data.payload.user.id,
          token: data.payload.token,
          user: data.payload.user,
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
