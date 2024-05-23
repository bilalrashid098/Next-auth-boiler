import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pagesOptions } from "./page-options";
import { adminDB } from "../../../../../lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: "Ie3/BTK4dv7AboOTcB19GfP6vhrwY2Z+/yJsWnRxbsc=",
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Configure one or more authentication providers
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      return {
        ...session,
        user: {
          data: token.user,
          ...session.user,
          id: token.idToken as string,
        },
      };
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // return user as JWT
        token.user = user;
      }
      if (trigger === "update" && session) {
        token.user = session;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url, baseUrl);
      if (parsedUrl.searchParams.has("callbackUrl")) {
        return `${baseUrl}${parsedUrl.searchParams.get("callbackUrl")}`;
      } else {
        return `${baseUrl}/`;
      }
    },
  },
  providers: [
    // ...add more providers here
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (credentials == null) return null;
        try {
          // const salt = await bcrypt.genSalt(10);
          // const hash = await bcrypt.hash("admin", salt);
          // console.log("HASH", hash);

          const user = await adminDB.users.findFirst({
            where: {
              email: credentials.email,
            },
          });

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              return user;
            } else {
              console.log("Error: Email or password is incorrect");
              throw new Error("Email or password is incorrect");
            }
          } else {
            console.log("Error: User not found");
            throw new Error("User not found");
          }
        } catch (err: any) {
          console.log("Error:", err);
          throw new Error(err);
        }
      },
    }),
  ],
};
export default NextAuth(authOptions);
