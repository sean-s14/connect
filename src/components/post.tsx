import { Types } from "mongoose";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Post({
  name,
  username,
  content,
  createdAt,
  likes = 0,
  replies,
  _id,
}: {
  name: string;
  username: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Types.ObjectId[];
  _id: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800">
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
        <div className="cursor-pointer mt-2 py-1 px-4 rounded-3xl flex gap-3 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit">
          {likes}
          <button>
            <HandThumbUpIcon className="h-6 w-6" />
          </button>
        </div>
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
