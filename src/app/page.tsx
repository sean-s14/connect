"use client";

import { useState } from "react";
import Post from "@/components/post";
import Input from "@/components/form/input";
import { AiOutlineSend } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner";
import usePagination from "@/hooks/usePagination";
import InfiniteScroll from "react-infinite-scroll-component";
import { IPostWithAuthorAndParent } from "@/types/post";

const fetchPosts = async (url: string) => {
  const res = await fetch(url);
  const { posts } = await res.json();
  return posts;
};

export default function Home() {
  const { status } = useSession();
  const [newPost, setNewPost] = useState("");
  const [selfPosts, setSelfPosts] = useState<IPostWithAuthorAndParent[]>([]);

  const {
    flattenedData: posts,
    error,
    isLoading,
    size,
    setSize,
    hasReachedEnd,
  } = usePagination<IPostWithAuthorAndParent>(
    "/api/posts/list",
    10,
    fetchPosts
  );

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
        selfPosts.map((post, index) => <Post key={index} post={post} />)}

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
          posts.map((post, index) => (
            <Post key={index} post={post} containerClassName="max-w-2xl" />
          ))}
      </InfiniteScroll>
    </main>
  );
}
