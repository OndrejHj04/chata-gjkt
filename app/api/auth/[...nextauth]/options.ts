import { userGoogleLogin, userLogin } from "@/lib/api";
import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      async profile(profile) {
        const user = await userGoogleLogin({ account: profile });
        if (!user) return { ...profile, id: profile.sub, forbidden: true };
        return user;
      },
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return;
        const user = await userLogin({
          email: credentials.email,
          password: credentials.password,
        });
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async signIn({ user }) {
      if (user.forbidden || !user.id) return false;

      return true;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    maxAge: 60 * 60 * 24,
    strategy: "jwt",
  },
};
