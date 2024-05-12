import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pagesOptions } from "./page-options";
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
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        // const res = await fetch("/your/endpoint", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // });
        // const user = await res.json();

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        if (credentials == null) return null;
        try {
          const user = {
            email: "bilal@yopmail.com",
            password: "12345",
            id: "1234",
          };

          if (
            credentials.email === user.email &&
            credentials.password === user.password
          ) {
            return { ...credentials, name: "Bilal" };
          } else {
            //   return null
            throw new Error("Email or password is incorrect");
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
