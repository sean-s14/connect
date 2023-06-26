"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function UserPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-w-100 min-h-screen flex flex-col items-center justify-start p-10">
      {session?.user?.image ? (
        <Image
          src={session?.user?.image || ""}
          alt="users profile image"
          width={120}
          height={120}
          priority={true}
          className="rounded-full mb-5"
        />
      ) : (
        <div className="w-[120px] h-[120px]"></div>
      )}
      <div className="text-xl font-bold">{session?.user?.name}</div>
    </div>
  );
}
