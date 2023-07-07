"use client";

import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Spinner from "@/components/loaders/spinner";
import convertDate from "@/utils/convertDate";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Reply({
  _id,
  author = { _id: "", name: "", username: "" },
  content = "",
  likes = 0,
  replyCount = 0,
  isDeleted = false,
  createdAt,
}: {
  _id: string;
  author: { _id: string; name: string; username: string };
  content: string;
  likes: number;
  replyCount: number;
  isDeleted: boolean;
  createdAt: Date;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(0);
  const [likedLoading, setLikedLoading] = useState(false);

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

  function viewPost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${author?.username}/${_id}`);
  }

  function viewProfile(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${author?.username}`);
  }

  return (
    <div className="py-2">
      <div
        className="flex items-center gap-2 font-semibold hover:bg-slate-700 transition-colors rounded-lg max-w-fit p-1 px-2 -ml-2 cursor-pointer"
        onClick={viewProfile}
        role="link"
      >
        <span className="font-normal text-sm">{author?.name}</span>·
        <span className="text-slate-500 text-sm">@{author?.username}</span>·
        <span className="text-slate-500 text-sm">{convertDate(createdAt)}</span>
      </div>

      <span
        className={`flex pt-1 ${isDeleted && "line-through text-slate-400"}`}
      >
        {content}
      </span>

      <div className="flex items-center">
        <button
          className={`mt-2 mr-2 py-0.5 px-3 rounded-3xl flex gap-2 items-center bg-slate-900 ${
            status === "authenticated" &&
            session?.user?.username !== author?.username
              ? "hover:bg-slate-950 cursor-pointer"
              : "cursor-default"
          } transition-colors ease-in-out duration-300 max-w-fit`}
          onClick={handleLike}
          disabled={
            status !== "authenticated" ||
            session?.user?.username === author?.username
          }
        >
          {likedLoading ? (
            <Spinner style={{ height: 15, width: 15, borderWidth: 3 }} />
          ) : (
            <span>{likes + liked}</span>
          )}
          <HandThumbUpIcon className="h-4 w-4" />
        </button>

        <div
          className="cursor-pointer mt-2 py-0.5 px-3 rounded-3xl flex items-center gap-2 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit"
          role="link"
          onClick={viewPost}
        >
          {replyCount}
          <ChatBubbleBottomCenterIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
