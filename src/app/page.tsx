"use client";

import { useState } from "react";
import { IPost } from "@/constants/schemas/post";
import Post from "@/components/post";
import { ParentPostType } from "@/components/post";
import Input from "@/components/form/input";
import { AiOutlineSend } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner";
import usePagination from "@/hooks/usePagination";
import InfiniteScroll from "react-infinite-scroll-component";

type Author = {
  _id: string;
  name: string;
  username: string;
};

type PostType = Omit<
  IPost,
  "updatedAt" | "__v" | "deletedAt" | "likes" | "parent" | "children" | "author"
> & {
  _id: string;
  author: Author;
  liked: boolean;
  likeCount: number;
  parent?: ParentPostType;
  children: number;
};

const fetchPosts = async (url: string) => {
  const res = await fetch(url);
  const { posts } = await res.json();
  return posts;
};

export default function Home() {
  const { status } = useSession();
  const [newPost, setNewPost] = useState("");
  const [selfPosts, setSelfPosts] = useState<PostType[]>([]);

  const {
    flattenedData: posts,
    error,
    isLoading,
    size,
    setSize,
    hasReachedEnd,
  } = usePagination<PostType>("/api/posts/list", 10, fetchPosts);

  function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newPost }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { post } = data;
        setSelfPosts((prev) => [post, ...prev]);
        setNewPost("");
      })
      .catch((err) => console.log(err));
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner style={{ width: 80, height: 80, borderWidth: 4 }} />
      </div>
    );
  }

  // TODO: Build out error page
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="py-8 px-10 flex flex-col gap-10 items-center min-h-screen">
      {status === "authenticated" && (
        <form
          onSubmit={handleCreatePost}
          className="bg-slate-800 border-solid border-2 border-slate-700 rounded-xl w-full max-w-2xl p-3 flex gap-4 items-center justify-around"
        >
          <Input
            placeholder="What's on your mind..."
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            multiline={true}
            name="newPost"
            id="newPost"
            containerClassName="w-full"
          />
          <button
            className="bg-slate-900 rounded-lg p-2 hover:bg-slate-700 transition-colors"
            type="submit"
          >
            <AiOutlineSend size={10} className="w-6 h-6" />
          </button>
        </form>
      )}

      {selfPosts.length > 0 &&
        selfPosts.map((post, index) => (
          <Post
            key={index}
            username={post.author.username}
            name={post.author.name}
            content={post.content}
            createdAt={post.createdAt}
            liked={post.liked}
            likeCount={post.likeCount}
            replyCount={post.children}
            _id={post._id}
          />
        ))}

      {/* TODO: Has its own scrollbar when loading more posts */}
      <InfiniteScroll
        dataLength={posts?.length ?? 0}
        next={() => setSize(size + 1)}
        hasMore={!hasReachedEnd}
        loader={<Spinner style={{ width: 40, height: 40, borderWidth: 3 }} />}
        endMessage={<p className="text-slate-500 text-center">No more posts</p>}
        className="flex flex-col gap-10 items-center"
        style={{ overflow: "hidden" }}
      >
        {Array.isArray(posts) &&
          posts.map(
            (
              {
                author,
                content,
                createdAt,
                liked,
                likeCount,
                parent,
                children: replyCount,
                _id,
              },
              index
            ) => (
              <Post
                key={index}
                username={author?.username}
                name={author?.name}
                content={content}
                createdAt={createdAt}
                liked={liked}
                likeCount={likeCount}
                parent={parent}
                replyCount={replyCount}
                _id={_id}
                containerClassName="max-w-2xl"
              />
            )
          )}
      </InfiniteScroll>
    </main>
  );
}
