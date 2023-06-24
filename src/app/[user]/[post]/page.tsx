import data from "../../data.posts.json";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";

export default function Post({
  params,
}: {
  params: { user: string; post: string };
}) {
  const post = data.find((post) => post.id.toString() === params.post);

  return (
    <div className="pt-10 min-w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 max-w-[90%] w-[600px] border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800">
        <div className="flex items-center gap-2 font-semibold">
          {post?.name}{" "}
          <div className="text-slate-500 text-sm">@{post?.handle}</div>
        </div>

        <div className="text-slate-500 text-sm">{post?.timestamp}</div>
        <div>{post?.content}</div>
        {/* Likes, Comments & Shares */}
        <div className="flex justify-start gap-2 mt-3">
          <div className="mt-2 py-1 px-4 rounded-3xl flex gap-3 bg-slate-900 max-w-fit">
            {post?.likes}
            <HandThumbUpIcon className="h-6 w-6" />
          </div>
          <div className="mt-2 py-1 px-4 rounded-3xl flex gap-3 bg-slate-900 max-w-fit">
            {post?.comments?.length}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
          </div>
        </div>
        <hr className="my-2 border-slate-500" />
        {Array.isArray(post?.comments) &&
        post?.comments?.length &&
        post.comments.length > 0 ? (
          post?.comments.map(
            ({ name, handle, timestamp, likes, content }, index) => (
              <div key={index} className="py-2">
                <div className="flex gap-2">
                  {name}
                  <div className="text-slate-500 text-sm">@{handle}</div>
                  <div className="text-slate-500 text-sm">{timestamp}</div>
                </div>

                <div className="pl-4">
                  <span className="float-left flex cursor-pointer mt-2 mr-2 py-1 px-3 rounded-3xl gap-2 bg-slate-900 hover:bg-slate-950 transition-colors ease-in-out duration-300 max-w-fit text-sm">
                    {likes}
                    <button>
                      <HandThumbUpIcon className="h-4 w-4" />
                    </button>
                  </span>
                  <span className="">{content}</span>
                </div>
              </div>
            )
          )
        ) : (
          <div className="text-slate-500 text-center">No comments</div>
        )}
      </div>
    </div>
  );
}
