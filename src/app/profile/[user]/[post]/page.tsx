"use client";

import useSWR from "swr";
import { IPost } from "@/constants/schemas/post";
import Post, { ParentPostType, ChildPostType } from "@/components/post";
import Spinner from "@/components/loaders/spinner";

type Author = {
  _id: string;
  name: string;
  username: string;
};

type OmmittedPostFields =
  | "updatedAt"
  | "__v"
  | "deletedAt"
  | "children"
  | "likes"
  | "author";

type PostType = Omit<IPost, OmmittedPostFields | "parent"> & {
  _id: string;
  liked: boolean;
  likeCount: number;
  author: Author;
  parent?: ParentPostType;
  children: ChildPostType[];
};

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
  } = useSWR<PostType>(`/api/posts?_id=${params.post}`, fetchPost);

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
        <Post
          name={post.author.name}
          username={post.author.username}
          content={post.content}
          createdAt={post.createdAt}
          liked={post.liked}
          likeCount={post.likeCount}
          replyCount={post.children.length}
          replies={post.children}
          parent={post.parent}
          _id={post._id}
          containerClassName="max-w-[90%]"
        />
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}
