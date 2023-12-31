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
import { IPostWithAuthorAndParent } from "@/types/post";

const styles = {
  username: "text-slate-500 text-xs sm:text-sm",
  date: "text-slate-500 text-xs sm:text-sm",
};

export default function Post(props: {
  post: IPostWithAuthorAndParent;
  onUpdate?: () => void;
  containerClassName?: string;
}) {
  const post = props.post;
  const { containerClassName = "" } = props;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(props?.post?.liked || false);
  const [likeCount, setLikeCount] = useState(props?.post?.likeCount || 0);
  const [likedLoading, setLikedLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleLike(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setLikedLoading(true);
    fetch(`/api/posts?_id=${post?._id.toString()}&like=true`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        setLikeCount(post?.likeCount || 0);
        setLiked(post?.liked || false);
      })
      .catch((err) => console.log(err))
      .finally(() => setLikedLoading(false));
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (
      session?.user?.username &&
      session.user.username !== post?.author?.username
    )
      return;
    fetch(`/api/posts?_id=${post?._id.toString()}`, {
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
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!session) return;
    if (!reply) return;
    setReplyLoading(true);
    fetch(`/api/posts?parentId=${post?._id.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: reply }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        props?.onUpdate?.();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setReply("");
        setReplyLoading(false);
        closeReplyModal();
      });
  }

  function openReplyModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setReplyModalOpen(true);
  }

  function closeReplyModal(
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setReplyModalOpen(false);
  }

  function openDeleteModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setDeleteModalOpen(true);
  }

  function closeDeleteModal(
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setDeleteModalOpen(false);
  }

  function viewPost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(`/profile/${post?.author?.username}/${post?._id.toString()}`);
  }

  function viewParentPost(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    router.push(
      `/profile/${
        post?.parent?.author?.username
      }/${post?.parent?._id?.toString()}`
    );
  }

  function viewProfile(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    // TODO: When updating profile username, returning to the profile page will not work. Instead find profile by id and use the 'as' prop in the router.push() function like so:
    // router.push(`/profile/${username}`, `/profile/${author._id}`);
    router.push(`/profile/${post?.author?.username}`);
  }

  return (
    <div
      className={`flex flex-col gap-2 w-full border-solid border-2 border-slate-700 px-4 sm:px-6 py-2 sm:py-4 shadow-slate-950 rounded-2xl bg-slate-800 relative cursor-pointer ${containerClassName} ${
        deleted && "hidden"
      }`}
      onClick={viewPost}
      role="link"
    >
      {/* Confirm Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        containerClassName="flex justify-center items-center cursor-default"
        modalClassName="max-w-[90%] w-[400px] bg-slate-800 p-6 rounded-xl flex flex-col items-center"
      >
        <span>Are you sure you want to delete this post?</span>
        <span className="text-slate-500 text-sm">
          This action is irriversible
        </span>
        <div className="flex gap-12 mt-6">
          <button
            onClick={closeDeleteModal}
            className="bg-slate-900 hover:bg-slate-950 py-1 w-20 rounded"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="bg-slate-900/60 hover:bg-red-800/50 py-1 w-20 rounded"
          >
            Yes
          </button>
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        open={replyModalOpen}
        onClose={closeReplyModal}
        containerClassName="flex justify-center items-center cursor-default"
        modalClassName="max-w-[90%] w-[500px] bg-slate-800 p-6 rounded-2xl flex flex-col items-center"
      >
        {/* Comment replying to */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2">
            <span
              className={`${
                !post?.author?.name && "line-through"
              } text-xs sm:text-sm`}
            >
              {post?.author?.name ?? "deleted"}
            </span>
            <span className="hidden sm:flex">·</span>
            <span
              className={`${styles.username} ${
                !post?.author?.name && "line-through"
              } text-xs sm:text-sm`}
            >
              @{post?.author?.username ?? "deleted"}
            </span>
            <span className="hidden sm:flex">·</span>
            <span className={`${styles.date} text-xs sm:text-sm`}>
              {post?.createdAt && convertDate(post.createdAt)}
            </span>
          </div>
          <p className="text-sm sm:text-md">{post?.content ?? "no content"}</p>
        </div>

        <hr className="m-2 w-0.5 h-10 bg-slate-100/40 border-none" />

        {/* User's reply */}
        <form className="w-full flex gap-3 items-center" onSubmit={handleReply}>
          <Input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply"
            name="reply"
            id="reply"
            multiline={true}
            containerClassName={`flex-1 ${
              replyLoading && "cursor-wait pointer-events-none opacity-50"
            }`}
          />
          <button
            className={`bg-slate-900 rounded-lg p-2 hover:bg-slate-700 transition-colors ${
              replyLoading && "cursor-wait pointer-events-none"
            }`}
            type="submit"
            disabled={replyLoading}
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
      {session?.user?.username &&
        session.user.username === post?.author?.username && (
          <button
            className="cursor-pointer p-0.5 absolute right-5 top-5 rounded-full border border-red-400 hover:bg-red-400/30 transition-colors"
            onClick={openDeleteModal}
          >
            <XMarkIcon className="h-7 w-7 text-red-400" />
          </button>
        )}

      {/* Name · Username · Date */}
      <div
        onClick={viewProfile}
        role="link"
        className="flex-col sm:flex-row flex items-start sm:items-center gap-0 sm:gap-2 font-semibold hover:bg-slate-700 transition-colors rounded-lg max-w-fit p-1 px-2 -ml-2"
      >
        <span
          className={`${
            !post?.author?.name && "line-through"
          } text-sm sm:text-md`}
        >
          {post?.author?.name ?? "deleted"}
        </span>
        <span className="hidden sm:flex">·</span>
        <span
          className={`${
            !post?.author?.name && "line-through"
          } text-slate-500 text-xs sm:text-sm`}
        >
          @{post?.author?.username ?? "deleted"}
        </span>
        <span className="hidden sm:flex">·</span>
        <span className="text-slate-500 text-xs sm:text-sm">
          {post?.createdAt && convertDate(post.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm sm:text-md">{post?.content ?? "no content"}</p>

      {/* Parent */}
      {post?.parent && (
        <div
          role="link"
          onClick={viewParentPost}
          className="border-2 border-slate-600 rounded-xl ml-8 p-2 flex flex-col gap-2 hover:bg-slate-700 transition-colors"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2">
            <span className="text-xs sm:text-sm text-slate-300">
              {post?.parent?.author?.name}
            </span>
            <span className="hidden sm:flex">·</span>
            <span className={`${styles.username}`}>
              {post?.parent?.author?.username}
            </span>
            <span className="hidden sm:flex">·</span>
            <span className={`${styles.username}`}>
              {post?.parent?.createdAt && convertDate(post.parent.createdAt)}
            </span>
          </div>
          <p className="text-md text-slate-300">
            {post?.parent?.content ?? "no content"}
          </p>
          {/* Likes and replies */}
          <div className="flex gap-2">
            <div
              className={`py-1 px-3 rounded-3xl flex gap-3 items-center max-w-fit bg-slate-900 ${
                post?.parent?.liked && "bg-slate-950"
              }`}
            >
              <span className="text-sm">{post?.parent?.likeCount || 0}</span>
              <HandThumbUpIcon className="h-4 w-4" />
            </div>
            <div className="py-1 px-3 rounded-3xl flex gap-3 items-center bg-slate-900 max-w-fit">
              <span className="text-sm">{post?.parent?.replyCount || 0}</span>
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
              status === "authenticated" &&
              session?.user?.username !== post?.author?.username
                ? "hover:bg-slate-950 cursor-pointer"
                : "cursor-default"
            } ${
              liked && "bg-slate-950"
            } transition-colors ease-in-out duration-300 max-w-fit`}
            onClick={handleLike}
            disabled={
              status !== "authenticated" ||
              session?.user?.username === post?.author?.username
            }
          >
            {likedLoading ? (
              <Spinner style={{ height: 15, width: 15, borderWidth: 3 }} />
            ) : (
              <span>{likeCount}</span>
            )}
            <HandThumbUpIcon className="h-6 w-6" />
          </button>

          {/* Comment Count & Link */}
          <div
            className="cursor-pointer mt-2 py-1 px-4 rounded-3xl flex items-center gap-3 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit"
            role="link"
            onClick={viewPost}
          >
            {post?.replyCount || 0}
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
        {post?.replies && post?.replies.length > 0 && (
          <div>
            <hr className="my-2 border-slate-500" />

            {post.replies.map(
              ({
                _id,
                author,
                content,
                isDeleted,
                liked,
                likeCount,
                replyCount,
                createdAt,
              }) => (
                <div key={_id.toString()}>
                  <hr className="ml-3 my-0.5 w-0.5 h-5 bg-slate-100/40 border-none" />
                  <Reply
                    _id={_id.toString()}
                    author={author}
                    content={content}
                    isDeleted={isDeleted ?? false}
                    liked={liked}
                    likeCount={likeCount}
                    replyCount={replyCount}
                    createdAt={createdAt}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
