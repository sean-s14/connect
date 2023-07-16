"use client";

import { useState } from "react";
import Input from "@/components/form/input";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/user";
import convertDate from "@/utils/convertDate";
import usePagination from "@/hooks/usePagination";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/components/loaders/spinner";

const fetchUsers = async (url: string) => {
  const res = await fetch(url);
  const { users } = await res.json();
  return users;
};

export default function SearchPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const {
    flattenedData: users,
    error: errorUsers,
    isLoading: isLoadingUsers,
    size,
    setSize,
    hasReachedEnd,
  } = usePagination<
    Omit<IUser, "email" | "password" | "dateOfBirth" | "gender" | "updatedAt">
  >(
    `/api/users${search && search !== "" && "?username=" + search}`,
    20,
    fetchUsers
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSearch(e.target.value);
  }

  function viewProfile(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    username: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${username}`);
  }

  if (errorUsers) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500 text-center">{errorUsers.message}</p>
      </div>
    );
  }

  return (
    <div className="py-10 flex flex-col items-center">
      <Input
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleChange}
        autoComplete="off"
        required={false}
        name="search"
        id="search"
        inputClassName="min-w-[90%] max-w-[500px]"
        Icon={AiOutlineSearch}
        iconPosition="left"
        iconClassName="h-8 w-8 text-slate-400"
      />

      {isLoadingUsers ? (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner style={{ width: 80, height: 80, borderWidth: 4 }} />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={users?.length ?? 0}
          next={() => setSize(size + 1)}
          hasMore={!hasReachedEnd}
          loader={<Spinner style={{ width: 40, height: 40, borderWidth: 3 }} />}
          endMessage={
            <p className="text-slate-500 text-center">No more users</p>
          }
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8"
          style={{ overflow: "hidden" }}
        >
          {Array.isArray(users) &&
            users.map((user, index) => (
              <button
                key={index}
                className="flex items-center py-2 px-4 rounded-md gap-3 bg-slate-800 hover:bg-slate-700 transition-colors border-2 border-slate-700"
                onClick={(e) => viewProfile(e, user?.username)}
              >
                <Image
                  src={user?.image ?? ""}
                  alt={user?.username}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <p className="text-lg font-semibold">{user?.username}</p>
                  <p className="text-sm text-slate-400">{user?.name}</p>
                  <p className="text-sm text-slate-400">
                    Joined {convertDate(user?.createdAt)}
                  </p>
                </div>
              </button>
            ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
