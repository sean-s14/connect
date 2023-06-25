"use client";

import { UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="min-h-screen w-40 bg-slate-200 dark:bg-slate-800 fixed backdrop-blur-sm flex flex-col items-center justify-between py-6">
      <Link href={"/"} className="text-2xl font-bold">
        Connect
      </Link>
      {session ? (
        <div className="flex flex-col gap-4 items-center">
          <Image
            src={session?.user?.image || ""}
            alt="users profile image"
            width={104}
            height={104}
            className="rounded outline outline-4 outline-slate-900"
          />
          <button
            className="btn-secondary w-28 text-center"
            onClick={() => signOut()}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Link
            href={"/api/auth/signin"}
            className="btn-secondary w-28 text-center"
          >
            Login
          </Link>
          <Link
            href={"/api/auth/signin"}
            className="btn-primary flex gap-2 items-center"
          >
            <UserPlusIcon className="h-5 w-5" /> Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
