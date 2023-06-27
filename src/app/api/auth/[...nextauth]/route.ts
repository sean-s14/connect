import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoClientPromise from "@/config/mongoClient";

const handler = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "",
        port: Number(process.env.EMAIL_SERVER_PORT) || 0,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASS || "",
        },
      },
      from: process.env.EMAIL_FROM || "",
    }),
  ],
});

export { handler as GET, handler as POST };
