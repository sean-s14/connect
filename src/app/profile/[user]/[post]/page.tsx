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

// TODO: Find way to display new replies without refreshing page
export default function PostPage({
  params,
}: {
  params: { user: string; post: string };
}) {
  const {
    data: post,
    error,
    isLoading,
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

  // TODO: Add error page
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-10 min-w-full flex flex-col items-center">
      {post ? (
        <Post post={post} containerClassName="max-w-[90%]" />
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}
