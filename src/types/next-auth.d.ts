import "next-auth";

declare module "next-auth" {
  // Used to include user id & username in session
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      id?: string | null;
    };
    expires: string;
  }
  // Used by /app/api/auth/[...nextauth]/route.ts to include user id & username in callbacks.session
  interface DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  }
}
