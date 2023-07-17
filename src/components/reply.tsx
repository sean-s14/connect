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
import { IPostAuthor } from "@/types/post";

export default function Reply(props: {
  _id: string;
  author?: IPostAuthor;
  content: string;
  liked: boolean;
  likeCount: number;
  replyCount: number;
  isDeleted: boolean;
  createdAt: Date;
}) {
  const {
    author = { _id: "", name: "", username: "", image: "" },
    content = "",
    replyCount = 0,
    isDeleted = false,
    createdAt,
  } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(props.liked || false);
  const [likeCount, setLikeCount] = useState(props.likeCount || 0);
  const [likedLoading, setLikedLoading] = useState(false);

  function handleLike() {
    setLikedLoading(true);
    fetch(`/api/posts?_id=${props._id}&like=true`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        setLikeCount(post?.likeCount);
        setLiked(post?.liked);
      })
      .catch((err) => console.log(err))
      .finally(() => setLikedLoading(false));
  }

  function viewPost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${author?.username}/${props._id}`);
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
        className="flex-col sm:flex-row flex items-start sm:items-center gap-0 sm:gap-2 font-semibold hover:bg-slate-700 transition-colors rounded-lg max-w-fit p-1 px-2 -ml-2 cursor-pointer"
        onClick={viewProfile}
        role="link"
      >
        <span
          className={`${
            !author?.name && "line-through"
          } font-normal text-xs sm:text-sm`}
        >
          {author?.name ?? "deleted"}
        </span>
        <span className="hidden sm:flex">·</span>
        <span
          className={`${
            !author?.name && "line-through"
          } text-slate-500 text-xs sm:text-sm`}
        >
          @{author?.username ?? "deleted"}
        </span>
        <span className="hidden sm:flex">·</span>
        <span className="text-slate-500 text-xs sm:text-sm">
          {convertDate(createdAt)}
        </span>
      </div>

      <span
        className={`flex pt-1 ${isDeleted && "line-through text-slate-400"}`}
      >
        {content}
      </span>

      {/* Like Button and Count */}
      <div className="flex items-center">
        <button
          className={`mt-2 mr-2 py-0.5 px-3 rounded-3xl flex gap-2 items-center bg-slate-900 ${
            status === "authenticated" &&
            session?.user?.username !== author?.username
              ? "hover:bg-slate-950 cursor-pointer"
              : "cursor-default"
          } ${
            liked && "bg-slate-950"
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
            <span>{likeCount}</span>
          )}
          <HandThumbUpIcon className="h-4 w-4" />
        </button>

        {/* Reply Count and link to post */}
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
