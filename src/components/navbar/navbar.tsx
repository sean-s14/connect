"use client";

import { useState, useEffect } from "react";
import {
  UserPlusIcon,
  UserIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { FaBarsStaggered } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  function toggleMenu() {
    setShowMenu((prev) => !prev);
  }

  if (status === "authenticated") {
    // Check if an object with text 'Profile' exists in the links array
    // If it does, do nothing, otherwise, add it to the beginning of the array
    if (!authenticatedLinks.find((link) => link.text === "Profile")) {
      authenticatedLinks.unshift({
        href: `/profile/${session?.user?.username}`,
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
    <nav className="h-20 sm:min-h-screen w-full sm:w-20 md:w-40 bg-slate-800 fixed backdrop-blur-sm flex sm:flex-col items-center justify-between sm:py-6 px-8 sm:px-0">
      {/* MOBILE < 640px */}
      <div className="w-full flex sm:hidden items-center justify-between px-8">
        {/* Menu Toggle */}
        <button onClick={toggleMenu} className="">
          <FaBarsStaggered className="h-8 w-8 md:h-5 md:w-5" />
        </button>

        {/* Website Logo/Name */}
        <Link href={"/"} className="text-2xl font-bold">
          Connect
        </Link>

        {/* Profile Image */}
        {session?.user?.image && (
          <Image
            src={session.user.image || ""}
            alt="users profile image"
            width={80}
            height={80}
            className="rounded-full outline outline-4 outline-slate-900 h-12 w-12 md:h-20 md:w-20"
          />
        )}

        {/* Navigation */}
        <div
          className={`border-t border-slate-300/50 py-4 absolute top-20 right-full translate-x-${
            showMenu ? "full" : 0
          } transition-all duration-700 w-full h-screen bg-slate-800`}
        >
          {/* Transition Opacity Container */}
          <div
            className={`w-full h-full flex flex-col items-center justify-start transition-opacity duration-500 ${
              status === "loading" && "opacity-0 pointer-events-none"
            }`}
          >
            {/* Links */}
            <div
              className={`flex flex-col gap-3 w-full items-center transition-opacity duration-500 `}
            >
              {links.map(({ href, text, Icon }) => (
                <Link
                  href={href}
                  key={href}
                  className="flex gap-4 items-center py-2 px-4 transition-colors duration-300 hover:bg-slate-900 bg-slate-700 w-full max-w-[95%] rounded-lg group relative"
                >
                  <Icon className="h-10 w-10" />
                  <span className="text-xl">{text}</span>
                </Link>
              ))}
            </div>

            <hr className="border border-slate-300 opacity-50 w-[60%] my-6" />

            {/* Authenticated Links */}
            <div className={`transition-opacity duration-300`}>
              {status === "authenticated" ? (
                <button
                  className="bg-slate-700 rounded-lg p-2 w-52 flex justify-center items-center gap-4"
                  onClick={() => signOut()}
                >
                  <FiLogOut className="h-10 w-10" />
                  <span className="text-xl">Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href={"/api/auth/signin"}
                    className="bg-slate-700 rounded-lg p-2 w-52 flex justify-center items-center gap-4"
                  >
                    <FiLogIn className="h-10 w-10" />
                    <span className="text-xl">Login</span>
                  </Link>
                  <Link
                    href={"/api/auth/signin"}
                    className="bg-slate-700 rounded-lg p-2 w-52 flex justify-center items-center gap-4"
                  >
                    <UserPlusIcon className="h-10 w-10" />
                    <span className="text-xl">Signup</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 640px < TABLET < 768px */}
      <div className="w-full h-full hidden sm:flex md:hidden flex-col items-center justify-between py-8">
        {/* Website Logo/Name & Profile Image */}
        <div className="flex flex-col gap-8 items-center">
          <Link href={"/"} className="text-2xl font-bold">
            C
          </Link>
          {session?.user?.image && (
            <Image
              src={session.user.image || ""}
              alt="users profile image"
              width={80}
              height={80}
              className="rounded-full outline outline-4 outline-slate-900 h-12 w-12"
            />
          )}
        </div>

        {/* Links */}
        <div
          className={`flex flex-col gap-2 w-[90%] items-center transition-opacity duration-500 ${
            status === "loading" && "opacity-0 pointer-events-none"
          }`}
        >
          {links.map(({ href, text, Icon }) => (
            <Link
              href={href}
              key={href}
              className="flex gap-2 items-center p-2 transition-colors duration-300 hover:bg-slate-700 w-[100%] max-w-fit rounded-full group relative"
            >
              <Icon className="h-8 w-8" />
              <span className="tooltip left-16">{text}</span> {/* Tooltip */}
            </Link>
          ))}
        </div>

        {/* Signin & Sign Out */}
        <div
          className={`flex transition-opacity duration-300 ${
            status === "loading" && "opacity-0 pointer-events-none"
          }`}
        >
          {status === "authenticated" ? (
            <button
              className="hover:bg-slate-700 p-3 rounded-full text-center flex gap-1 justify-around items-center transition-colors group relative"
              onClick={() => signOut()}
            >
              <FiLogOut className="h-8 w-8" />
              <span className="tooltip left-16">Logout</span> {/* Tooltip */}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={"/api/auth/signin"}
                className="flex gap-2 items-center justify-center p-3 hover:bg-slate-700 rounded-full group relative"
              >
                <FiLogIn className="h-8 w-8 md:h-5 md:w-5" />
                <span className="tooltip left-16">Login</span> {/* Tooltip */}
              </Link>
              <Link
                href={"/api/auth/signin"}
                className="hover:bg-slate-700 flex gap-2 items-center justify-center p-3 rounded-full group relative"
              >
                <UserPlusIcon className="h-8 w-8" />
                <span className="tooltip left-16">Signup</span> {/* Tooltip */}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 768px < DESKTOP */}
      <div className="w-full h-full hidden md:flex flex-col items-center justify-between py-8">
        {/* Website Logo/Name & Profile Image */}
        <div className="flex flex-col gap-8 items-center">
          <Link href={"/"} className="text-2xl font-bold">
            Connect
          </Link>
          {session?.user?.image && (
            <Image
              src={session.user.image || ""}
              alt="users profile image"
              width={80}
              height={80}
              className="rounded-full outline outline-4 outline-slate-900 h-20 w-20"
            />
          )}
        </div>

        {/* Links */}
        <div
          className={`flex flex-col gap-2 w-[90%] items-center  transition-opacity duration-500 ${
            status === "loading" && "opacity-0 pointer-events-none"
          }`}
        >
          {links.map(({ href, text, Icon }) => (
            <Link
              href={href}
              key={href}
              className="flex gap-2 items-center p-2 transition-colors duration-300 hover:bg-slate-700 w-[100%] max-w-[100%] rounded-none group relative"
            >
              <Icon className="h-6 w-6" />
              <span className="text-lg">{text}</span>
            </Link>
          ))}
        </div>

        {/* Signin & Sign Out */}
        <div
          className={`hidden md:flex transition-opacity duration-300 ${
            status === "loading" && "opacity-0 pointer-events-none"
          }`}
        >
          {status === "authenticated" ? (
            <button
              className="p-2 btn-outline w-32 text-center flex gap-1 justify-around items-center transition-colors"
              onClick={() => signOut()}
            >
              <FiLogOut className="h-5 w-5" />
              <span className="">Logout</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={"/api/auth/signin"}
                className="w-32 btn-outline flex gap-2 items-center justify-center p-2"
              >
                <FiLogIn className="h-6 w-6" />
                <span className="font-medium">Login</span>
              </Link>
              <Link
                href={"/api/auth/signin"}
                className="btn-solid flex gap-2 items-center justify-center p-2"
              >
                <UserPlusIcon className="h-6 w-6" />
                <span className="font-medium">Signup</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
