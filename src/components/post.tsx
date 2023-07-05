"use client";

import { Types } from "mongoose";
import { useState } from "react";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BsReply } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner";
import Modal from "@/components/modal";
import Input from "@/components/form/input";
import convertDate from "@/utils/convertDate";

const styles = {
  username: "text-slate-500 text-sm",
  date: "text-slate-500 text-sm",
};

export type ParentPost = {
  author: { name: string; username: string; _id: string };
  content: string;
  createdAt: Date;
  likes: Types.ObjectId[];
  children: Types.ObjectId[];
  _id: string;
};

export default function Post({
  name,
  username,
  content,
  createdAt,
  likes = 0,
  parent,
  replies,
  _id,
  containerClassName = "",
}: {
  name: string;
  username: string;
  content: string;
  createdAt: Date;
  likes: number;
  parent?: ParentPost;
  replies?: Types.ObjectId[];
  _id: string;
  containerClassName?: string;
}) {
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(0);
  const [likedLoading, setLikedLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

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

  function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;
    if (!reply) return;
    setReplyLoading(true);
    fetch(`/api/posts?parentId=${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: reply }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        console.log(post);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setReply("");
        setReplyLoading(false);
        closeReplyModal();
      });
  }

  function openReplyModal() {
    setReplyModalOpen(true);
  }

  function closeReplyModal() {
    setReplyModalOpen(false);
  }

  return (
    <div
      className={`flex flex-col gap-2 w-full border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800 relative ${containerClassName} ${
        deleted && "hidden"
      }`}
    >
      {/* Reply Modal */}
      <Modal
        open={replyModalOpen}
        onClose={closeReplyModal}
        containerClassName="flex justify-center items-center"
        modalClassName="max-w-[90%] w-[500px] bg-slate-800 p-6 rounded-2xl flex flex-col items-center"
      >
        {/* Comment replying to */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <span>{name}</span>·
            <span className={`${styles.username}`}>@{username}</span>·
            <span className={`${styles.date}`}>{convertDate(createdAt)}</span>
          </div>
          <p>{content}</p>
        </div>

        <hr className="m-2 w-0.5 h-10 bg-slate-100/40 border-none" />

        {/* User's reply */}
        <form className="w-full flex gap-3 items-center" onSubmit={handleReply}>
          {/* TODO: Disable input whilst replyLoading is true */}
          <Input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply"
            name="reply"
            id="reply"
            multiline={true}
            containerClassName="flex-1"
          />
          <button
            className="bg-slate-900 rounded-lg p-2 hover:bg-slate-700 transition-colors"
            type="submit"
          >
            {replyLoading ? (
              <Spinner style={{ width: 24, height: 24, borderWidth: 2 }} />
            ) : (
              <AiOutlineSend size={10} className="w-6 h-6" />
            )}
          </button>
        </form>
      </Modal>

      {/* Delete Button */}
      {session?.user?.username === username && (
        <button
          className="cursor-pointer p-0.5 absolute right-5 top-5 rounded border border-red-400 hover:bg-red-400/30 transition-colors"
          onClick={handleDelete}
        >
          <XMarkIcon className="h-7 w-7 text-red-400" />
        </button>
      )}

      {/* Name & Username */}
      <div className="flex items-center gap-2 font-semibold">
        {name} <div className="text-slate-500 text-sm">@{username}</div>
      </div>

      {/* Date */}
      <div className="text-slate-500 text-sm">{convertDate(createdAt)}</div>

      {/* Content */}
      <p>{content}</p>

      {/* Parent */}
      {/* {parent && <Link href={`/profile/${parent?.author}/`}>{parent?.content}</Link>} */}
      {parent && (
        <div className="border-2 border-slate-600 rounded-xl ml-8 p-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">
              {parent?.author?.name}
            </span>
            ·
            <span className={`${styles.username}`}>
              {parent?.author?.username}
            </span>
            ·
            <span className={`${styles.username}`}>
              {convertDate(parent?.createdAt)}
            </span>
          </div>
          <p className="text-md text-slate-300">{parent?.content}</p>
          {/* Likes and replies */}
          <div className="flex gap-2">
            <div className="py-1 px-3 rounded-3xl flex gap-3 items-center bg-slate-900 max-w-fit">
              <span className="text-sm">{parent?.likes?.length || 0}</span>
              <HandThumbUpIcon className="h-4 w-4" />
            </div>
            <div className="py-1 px-3 rounded-3xl flex gap-3 items-center bg-slate-900 max-w-fit">
              <span className="text-sm">{parent?.children?.length || 0}</span>
              <ChatBubbleBottomCenterIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Likes & Comments & Reply */}
      <div className="flex justify-between mt-3">
        <div className="flex justify-start gap-2">
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
          <button className="cursor-pointer mt-2 py-1 px-4 rounded-3xl flex items-center gap-3 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit">
            {replies?.length}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Reply */}
        <button
          className="cursor-pointer mt-2 py-1 px-3 rounded-3xl flex items-center gap-2 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit"
          onClick={openReplyModal}
        >
          <span className="text-sm">Reply</span>
          <BsReply className="h-6 w-6" />
        </button>
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
