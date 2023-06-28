"use client";

import {
  UserPlusIcon,
  UserIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const links = [
  {
    href: "/",
    text: "Home",
    Icon: HomeIcon,
  },
  {
    href: "/explore",
    text: "Explore",
    Icon: MagnifyingGlassIcon,
  },
];

const authenticatedLinks = [
  {
    href: "/settings",
    text: "Settings",
    Icon: Cog6ToothIcon,
  },
];

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    // Check if an object with text 'Profile' exists in the links array
    // If it does, do nothing, otherwise, add it to the beginning of the array
    if (!authenticatedLinks.find((link) => link.text === "Profile")) {
      authenticatedLinks.unshift({
        href: `/${session?.user?.username}`,
        text: "Profile",
        Icon: UserIcon,
      });
    }

    // Add authenticated links to links array if they don't already exist
    links.push(
      ...authenticatedLinks.filter(
        (link) => !links.find((l) => l.text === link.text)
      )
    );
  }

  return (
    <nav className="min-h-screen w-40 bg-slate-200 dark:bg-slate-800 fixed backdrop-blur-sm flex flex-col items-center justify-between py-6">
      <Link href={"/"} className="text-2xl font-bold">
        Connect
      </Link>
      <div className="flex flex-col gap-2 w-[90%] items-center">
        {links.map(({ href, text, Icon }) => (
          <Link
            href={href}
            key={href}
            className="flex gap-2 items-center w-[100%] p-2 transition-colors duration-300 hover:bg-slate-700"
          >
            <Icon className="h-5 w-5" /> {text}
          </Link>
        ))}
      </div>
      {status === "authenticated" ? (
        <div className="flex flex-col gap-4 items-center">
          {session?.user?.image && (
            <Image
              src={session.user.image || ""}
              alt="users profile image"
              width={80}
              height={80}
              className="rounded-full outline outline-4 outline-slate-900"
            />
          )}
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
