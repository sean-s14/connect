"use client";

import { useState } from "react";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BsReply } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner";
import Modal from "@/components/modal";
import Input from "@/components/form/input";
import convertDate from "@/utils/convertDate";
import Reply from "@/components/reply";

const styles = {
  username: "text-slate-500 text-sm",
  date: "text-slate-500 text-sm",
};

type AuthorType = {
  _id: string;
  name: string;
  username: string;
};

export type ParentPostType = {
  author: { name: string; username: string; _id: string };
  content: string;
  createdAt: Date;
  likes: number;
  children: number;
  _id: string;
};

export type ChildPostType = {
  _id: string;
  author: AuthorType;
  content: string;
  isDeleted: boolean;
  likes: number;
  children: number;
  createdAt: Date;
};

// TODO: Indicate if a post has been liked by the user by changing the color of the like button this can be done by returning an extra field in the post object called 'liked' which is a boolean

export default function Post({
  name = "",
  username = "",
  content = "no content",
  createdAt,
  likes = 0,
  parent,
  replyCount = 0,
  replies = [],
  _id,
  containerClassName = "",
}: {
  name: string;
  username: string;
  content: string;
  createdAt: Date;
  likes?: number;
  parent?: ParentPostType;
  replyCount?: number;
  replies?: ChildPostType[];
  _id: string;
  containerClassName?: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
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

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
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

  function viewPost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${username}/${_id}`);
  }

  function viewParentPost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${parent?.author?.username}/${parent?._id}`);
  }

  function viewProfile(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${username}`);
  }

  return (
    <div
      className={`flex flex-col gap-2 w-full border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800 relative cursor-pointer ${containerClassName} ${
        deleted && "hidden"
      }`}
      onClick={viewPost}
      role="link"
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
          className="cursor-pointer p-0.5 absolute right-5 top-5 rounded-full border border-red-400 hover:bg-red-400/30 transition-colors"
          onClick={handleDelete}
        >
          <XMarkIcon className="h-7 w-7 text-red-400" />
        </button>
      )}

      {/* Name · Username · Date */}
      <div
        onClick={viewProfile}
        role="link"
        className="flex items-center gap-2 font-semibold hover:bg-slate-700 transition-colors rounded-lg max-w-fit p-1 px-2 -ml-2"
      >
        <span>{name}</span>·
        <span className="text-slate-500 text-sm">@{username}</span>·
        <div className="text-slate-500 text-sm">{convertDate(createdAt)}</div>
      </div>

      {/* Content */}
      <p>{content}</p>

      {/* Parent */}
      {parent && (
        <div
          role="link"
          onClick={viewParentPost}
          className="border-2 border-slate-600 rounded-xl ml-8 p-2 flex flex-col gap-2 hover:bg-slate-700 transition-colors"
        >
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
              <span className="text-sm">{parent?.likes || 0}</span>
              <HandThumbUpIcon className="h-4 w-4" />
            </div>
            <div className="py-1 px-3 rounded-3xl flex gap-3 items-center bg-slate-900 max-w-fit">
              <span className="text-sm">{parent?.children || 0}</span>
              <ChatBubbleBottomCenterIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Likes & Comments & Reply */}
      <div className="flex justify-between mt-3">
        <div className="flex justify-start gap-2">
          {/* Like Count & Button */}
          <button
            className={`mt-2 py-1 px-4 rounded-3xl flex gap-3 items-center bg-slate-900 ${
              status === "authenticated" && session?.user?.username !== username
                ? "hover:bg-slate-950 cursor-pointer"
                : "cursor-default"
            } transition-colors ease-in-out duration-300 max-w-fit`}
            onClick={handleLike}
            disabled={
              status !== "authenticated" || session?.user?.username === username
            }
          >
            {likedLoading ? (
              <Spinner style={{ height: 15, width: 15, borderWidth: 3 }} />
            ) : (
              <span>{likes + liked}</span>
            )}
            <HandThumbUpIcon className="h-6 w-6" />
          </button>

          {/* Comment Count & Link */}
          <div
            className="cursor-pointer mt-2 py-1 px-4 rounded-3xl flex items-center gap-3 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit"
            role="link"
            onClick={viewPost}
          >
            {replyCount}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Reply */}
        {session?.user && (
          <button
            className="cursor-pointer mt-2 py-1 px-3 rounded-3xl flex items-center gap-2 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit"
            onClick={openReplyModal}
          >
            <span className="text-sm">Reply</span>
            <BsReply className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Replies */}
      <div className="cursor-auto flex flex-col gap-2">
        {replies && replies.length > 0 && (
          <>
            <hr className="my-2 border-slate-500" />

            {replies.map(
              ({
                _id,
                author,
                content,
                isDeleted,
                likes,
                children,
                createdAt,
              }) => (
                <div key={_id}>
                  <hr className="ml-3 my-0.5 w-0.5 h-5 bg-slate-100/40 border-none" />
                  <Reply
                    _id={_id}
                    author={author}
                    content={content}
                    isDeleted={isDeleted}
                    likes={likes}
                    replyCount={children}
                    createdAt={createdAt}
                  />
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
