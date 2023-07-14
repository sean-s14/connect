"use client";

import { useState } from "react";
import Post from "@/components/post";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner";
import usePagination from "@/hooks/usePagination";
import InfiniteScroll from "react-infinite-scroll-component";
import { IPostWithAuthorAndParent } from "@/types/post";
import NewPost from "@/components/newPost";
import { splitOnUpper, capitaliseAll } from "@sean14/utils";

const fetchPosts = async (url: string) => {
  const res = await fetch(url);
  const { posts } = await res.json();
  return posts;
};

type Tab = "forYou" | "following";
const TABS: Tab[] = ["forYou", "following"];

export default function Home() {
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("forYou");
  const [selfPosts, setSelfPosts] = useState<IPostWithAuthorAndParent[]>([]);

  const {
    flattenedData: posts,
    error,
    isLoading,
    size,
    setSize,
    hasReachedEnd,
  } = usePagination<IPostWithAuthorAndParent>(
    "/api/posts/list" + (activeTab === "forYou" ? "" : "?following=true"),
    10,
    fetchPosts
  );

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
    <main className="pb-8 flex flex-col gap-10 items-center min-h-screen">
      {status === "authenticated" && (
        <div className="grid grid-cols-2 w-full">
          {TABS.map((tab, index) => (
            <button
              key={index}
              className={`text-center py-2 hover:bg-slate-700/20 transition-colors ${
                activeTab === tab && "border-b-2 border-slate-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {capitaliseAll(splitOnUpper(tab))}
            </button>
          ))}
        </div>
      )}

      <div className="w-full max-w-[90%]">
        {status === "authenticated" && (
          <NewPost
            onPostCreated={(post) => setSelfPosts((prev) => [post, ...prev])}
            containerClassName="mb-10"
          />
        )}

        {selfPosts.length > 0 &&
          selfPosts.map((post, index) => <Post key={index} post={post} />)}

        <InfiniteScroll
          dataLength={posts?.length ?? 0}
          next={() => setSize(size + 1)}
          hasMore={!hasReachedEnd}
          loader={<Spinner style={{ width: 40, height: 40, borderWidth: 3 }} />}
          endMessage={
            <p className="text-slate-500 text-center">No more posts</p>
          }
          className="flex flex-col gap-10 items-center"
          style={{ overflow: "hidden" }}
        >
          {Array.isArray(posts) &&
            posts.map((post, index) => (
              <Post key={index} post={post} containerClassName="max-w-2xl" />
            ))}
        </InfiniteScroll>
      </div>
    </main>
  );
}
