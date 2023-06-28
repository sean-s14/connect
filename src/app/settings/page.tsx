"use client";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { status } = useSession({ required: true });

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center py-10">
      <h1 className="text-xl">Settings</h1>
    </div>
  );
}
