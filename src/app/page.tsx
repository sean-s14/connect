import Link from "next/link";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import feedTestData from "@/app/data.posts.json";

export default function Home() {
  return (
    <main className="py-8 flex flex-col gap-10 items-center">
      {feedTestData.map(
        (
          { id, name, handle, timestamp, content, likes, shares, comments },
          index
        ) => (
          <div
            key={index}
            className="flex flex-col gap-2 max-w-[90%] w-[600px] border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800"
          >
            <div className="flex items-center gap-2 font-semibold">
              {name} <div className="text-slate-500 text-sm">@{handle}</div>
            </div>

            <div className="text-slate-500 text-sm">{timestamp}</div>
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
                {comments?.length}
                <button>
                  <ChatBubbleBottomCenterIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <hr className="my-2 border-slate-500" />
            {Array.isArray(comments) && comments.length > 0 ? (
              <Link className="text-center" href={`/profile/${handle}/${id}`}>
                View Comments
              </Link>
            ) : (
              <div className="text-slate-500 text-center">No comments</div>
            )}
          </div>
        )
      )}
    </main>
  );
}
