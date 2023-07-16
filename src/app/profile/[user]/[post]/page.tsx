"use client";

import useSWR from "swr";
import Post from "@/components/post";
import { IPostWithAuthorAndParent } from "@/types/post";
import Spinner from "@/components/loaders/spinner";

const fetchPost = async (url: string) => {
  const res = await fetch(url);
  const { post } = await res.json();
  return post;
};

export default function PostPage({
  params,
}: {
  params: { user: string; post: string };
}) {
  const {
    data: post,
    error,
    isLoading,
    mutate: mutatePost,
  } = useSWR<IPostWithAuthorAndParent>(
    `/api/posts?_id=${params.post}`,
    fetchPost
  );

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner style={{ width: 80, height: 80, borderWidth: 4 }} />
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500 text-center">{error.message}</p>
      </div>
    );

  return (
    <div className="pt-10 min-w-full flex flex-col items-center">
      {post ? (
        <Post
          post={post}
          containerClassName="max-w-[90%]"
          onUpdate={mutatePost}
        />
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}
