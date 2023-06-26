"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Spinner } from "@/components/server";

export default function SettingsPage() {
  const { status } = useSession();

  if (status !== "authenticated") {
    return (
      <div className="min-w-full min-h-screen flex flex-col items-center justify-center">
        {status === "unauthenticated" && (
          <Link href="/api/auth/signin">Login to see this page</Link>
        )}
        {status === "loading" && (
          <Spinner style={{ width: 100, height: 100 }} />
        )}
      </div>
    );
  }

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center py-10">
      <h1 className="text-xl">Settings</h1>
    </div>
  );
}
