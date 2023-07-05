"use client";

import { Types } from "mongoose";
import { useState } from "react";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner";

export default function Post({
  name,
  username,
  content,
  createdAt,
  likes = 0,
  replies,
  _id,
  containerClassName = "",
}: {
  name: string;
  username: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Types.ObjectId[];
  _id: string;
  containerClassName?: string;
}) {
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(0);
  const [likedLoading, setLikedLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleLike() {
    setLikedLoading(true);
    fetch(`/api/posts?_id=${_id}&like=true`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        if (post?.likes?.length > likes) {
          setLiked(1);
        } else if (post?.likes?.length === likes) {
          setLiked(0);
        } else {
          setLiked(-1);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLikedLoading(false));
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    fetch(`/api/posts?_id=${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setDeleted(true);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div
      className={`flex flex-col gap-2 w-full border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800 relative ${containerClassName} ${
        deleted && "hidden"
      }`}
    >
      {/* Delete Button */}
      {session?.user?.username === username && (
        <button
          className="cursor-pointer p-0.5 absolute right-5 top-5 rounded border border-red-400 hover:bg-red-400/30 transition-colors"
          onClick={handleDelete}
        >
          <XMarkIcon className="h-7 w-7 text-red-400" />
        </button>
      )}

      <div className="flex items-center gap-2 font-semibold">
        {name} <div className="text-slate-500 text-sm">@{username}</div>
      </div>

      <div className="text-slate-500 text-sm">
        {new Date(createdAt).toLocaleString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <div>{content}</div>

      {/* Likes & Comments */}
      <div className="flex justify-start gap-2 mt-3">
        <button
          className={`mt-2 py-1 px-4 rounded-3xl flex gap-3 items-center bg-slate-900 ${
            status === "authenticated"
              ? "hover:bg-slate-950 cursor-pointer"
              : "cursor-default"
          } transition-colors ease-in-out duration-300 max-w-fit`}
          onClick={handleLike}
          disabled={status !== "authenticated"}
        >
          {likedLoading ? (
            <Spinner style={{ height: 15, width: 15, borderWidth: 3 }} />
          ) : (
            <span>{likes + liked}</span>
          )}
          <HandThumbUpIcon className="h-6 w-6" />
        </button>
        <div className="cursor-pointer mt-2 py-1 px-4 rounded-3xl flex gap-3 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit">
          {replies?.length}
          <button>
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <hr className="my-2 border-slate-500" />
      {Array.isArray(replies) && replies.length > 0 ? (
        <Link className="text-center" href={`/profile/${username}/${_id}`}>
          View Comments
        </Link>
      ) : (
        <div className="text-slate-500 text-center">No comments</div>
      )}
    </div>
  );
}
