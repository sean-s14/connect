"use client";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession({ required: true });

  function handleDeleteAccount() {
    // TODO: Create a confirmation dialog to replace the browser's default one
    if (
      confirm("Are you sure you want to delete your account?") &&
      session?.user?.username
    ) {
      fetch(`/api/users/${session.user.username}/private`, {
        method: "DELETE",
      })
        .then(() => {
          window.location.replace("/");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center py-10">
      <h1 className="text-xl">Settings</h1>
      <hr className="border border-slate-50/50 w-[60%] m-6" />
      <button
        className="btn p-2 text-red-500 border-red-500 hover:bg-red-300/20"
        onClick={handleDeleteAccount}
      >
        Delete Account
      </button>
    </div>
  );
}
