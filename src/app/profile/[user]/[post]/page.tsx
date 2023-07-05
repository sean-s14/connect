"use client";

import { useState, useEffect } from "react";
import {
  HandThumbUpIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import { IPost } from "@/constants/schemas/post";
import convertDate from "@/utils/convertDate";

type Author = {
  name: string;
  username: string;
  _id: string;
};

type IPostWithAuthor = Omit<IPost, "author"> & { author: Author };

type IPostWithAuthorAndChildren = Omit<IPostWithAuthor, "children"> & {
  children: IPostWithAuthor[];
};

export default function Post({
  params,
}: {
  params: { user: string; post: string };
}) {
  const [post, setPost] = useState<IPostWithAuthorAndChildren | null>(null);

  useEffect(() => {
    fetch(`/api/posts?_id=${params.post}`)
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        console.log("Post:", post);
        setPost(post);
      });
  }, [params.post]);

  return (
    <div className="pt-10 min-w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 max-w-[90%] w-[600px] border-solid border-2 border-slate-700 px-6 py-4 shadow-slate-950 rounded-2xl bg-slate-800">
        <div className="flex items-center gap-2 font-semibold">
          {post?.author?.name}{" "}
          <div className="text-slate-500 text-sm">
            @{post?.author?.username}
          </div>
        </div>

        <div className="text-slate-500 text-sm">
          {post?.createdAt && convertDate(post.createdAt)}
        </div>
        <div>{post?.content}</div>

        {/* Count for Likes & Comments */}
        <div className="flex justify-start gap-2 mt-3">
          <div className="mt-2 py-1 px-4 rounded-3xl flex gap-3 bg-slate-900 max-w-fit">
            {post?.likes?.length || 0}
            <HandThumbUpIcon className="h-6 w-6" />
          </div>
          <div className="mt-2 py-1 px-4 rounded-3xl flex gap-3 bg-slate-900 max-w-fit">
            {post?.children?.length}
            <ChatBubbleBottomCenterIcon className="h-6 w-6" />
          </div>
        </div>
        {/* TODO: Add reply button here */}
        <hr className="my-2 border-slate-500" />

        {/* Comments */}
        {Array.isArray(post?.children) &&
        post?.children?.length &&
        post.children.length > 0 ? (
          post?.children.map(({ author, createdAt, likes, content }, index) => (
            // TODO: Turn this into a link to the comment
            <div key={index} className="py-2">
              <div className="flex items-center gap-2">
                <span>{author?.name}</span>·
                <span className="text-slate-500 text-sm">
                  @{author?.username}
                </span>
                ·
                <span className="text-slate-500 text-sm">
                  {convertDate(createdAt)}
                </span>
              </div>

              <div className="pl-4">
                <span className="float-left flex items-center mt-2 mr-2 py-1 px-3 rounded-3xl gap-2 bg-slate-900 transition-colors ease-in-out duration-300 max-w-fit text-sm">
                  <span>{likes?.length || 0}</span>
                  {/* TODO: Enable liking reply */}
                  <span>
                    <HandThumbUpIcon className="h-4 w-4" />
                  </span>
                </span>
                <span className="flex pt-1">{content}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-500 text-center">No comments</div>
        )}
      </div>
    </div>
  );
}
