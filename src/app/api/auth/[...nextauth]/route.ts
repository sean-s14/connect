import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import MongoDBAdapter from "@/config/mongoDBAdapter";
import mongoClientPromise from "@/config/mongoClient";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

export const authOptions = {
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
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
    }),
  ],
  callbacks: {
    session: async ({
      session,
      user,
    }: {
      session: Session;
      user: AdapterUser;
    }) => {
      if (session?.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        if (user?.image) {
          session.user.image = user.image;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
