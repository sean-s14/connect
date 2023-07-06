"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IUser } from "@/constants/schemas/user";
import { IPost } from "@/constants/schemas/post";
import Image from "next/image";
import Link from "next/link";
import { IoCalendar } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Post from "@/components/post";
import { ParentPost } from "@/components/post";

type OmmittedPostFields =
  | "updatedAt"
  | "__v"
  | "deletedAt"
  | "children"
  | "likes"
  | "author"
  | "posts";

type Author = {
  _id: string;
  name: string;
  username: string;
};

type PostType = Omit<IPost, OmmittedPostFields> & {
  _id: string;
  author: Author;
  likes: number;
  children: number;
  parent?: ParentPost;
};

interface IUserWithPosts extends Omit<IUser, "posts"> {
  posts: PostType[];
}

export default function UserPage(props: { params: { user: string } }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUserWithPosts | null>(null);
  const [loading, setLoading] = useState(true); // loading state for fetching user data

  useEffect(() => {
    // fetch user data by username
    setLoading(true);
    if (props.params.user) {
      fetch(`/api/users/${props.params.user}`)
        .then((res) => res.json())
        .then((data) => {
          const { user } = data;
          setUser(user);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [props.params.user]);

  return (
    <div
      className={`${
        session?.user && !loading
          ? "opacity-1"
          : "pointer-events-none opacity-0"
      } flex flex-col items-start justify-start p-10 min-w-100 min-h-screen transition-opacity duration-500`}
    >
      {session?.user?.image ? (
        <Image
          src={session?.user?.image || ""}
          alt="users profile image"
          width={120}
          height={120}
          priority={true}
          className="rounded-full mb-5 self-center outline outline-4 outline-slate-950"
        />
      ) : (
        <div className="w-[120px] h-[120px]"></div>
      )}
      <div className="flex flex-col gap-2 mt-5 w-full max-w-2xl self-center relative">
        <div className="text-xl font-bold">{session?.user?.name}</div>
        {session?.user?.username && (
          <div className="text-md font-medium text-slate-500">
            @{session.user.username}
          </div>
        )}
        {user?.createdAt && (
          <div className="text-md font-medium text-slate-500 flex items-center gap-1">
            <IoCalendar className="h-4 w-4 inline-flex" />
            <span>Joined</span>
            {new Date(user.createdAt).toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </div>
        )}
        {user?.bio && (
          <div className="text-md font-normal text-slate-300">{user?.bio}</div>
        )}
        {session?.user?.username === props.params.user && (
          <Link
            href="/profile"
            className="flex items-center gap-2 absolute right-4 bg-slate-900 rounded-lg border-2 border-slate-950 py-1 px-3 text-slate-50 hover:bg-slate-950 transition-colors duration-500"
          >
            <FiEdit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>

      {/* Post Container */}
      <div className="w-full max-w-2xl self-center items-center mt-10 flex flex-col gap-6">
        {user?.posts &&
          user?.posts.length > 0 &&
          user?.posts.map(
            ({ _id, content, createdAt, likes, children, parent }, index) => (
              <Post
                key={index}
                name={user?.name}
                username={user.username}
                content={content}
                createdAt={createdAt}
                likes={likes}
                parent={parent}
                replies={children}
                _id={_id}
              />
            )
          )}
      </div>
      {/* TODO: Include pagination for posts */}
    </div>
  );
}
