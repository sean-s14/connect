"use client";

import { useState, useEffect } from "react";
import { IPost } from "@/constants/schemas/post";
import { IUser } from "@/constants/schemas/user";
import Post from "@/components/post";
import Input from "@/components/form/input";
import { AiOutlineSend } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Spinner from "@/components/loaders/spinner/spinner";

interface IPostWithAuthor extends Omit<IPost, "author"> {
  _id: string;
  author: IUser;
}

export default function Home() {
  const { status } = useSession();
  // TODO: cache feed with option to refresh
  const [feed, setFeed] = useState<IPostWithAuthor[]>([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // fetch feed
    fetch("/api/posts/list")
      .then((res) => res.json())
      .then((data) => {
        const { posts } = data;
        setFeed(posts);
      })
      .catch((err) => console.log(err));
  }, []);

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
        setFeed([post, ...feed]);
        setNewPost("");
      })
      .catch((err) => console.log(err));
  }

  return (
    <main className="py-8 px-10 flex flex-col gap-10 items-center">
      {status === "loading" ? (
        <Spinner style={{ width: 60, height: 60 }} />
      ) : (
        <>
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
          {Array.isArray(feed) &&
            feed.map(
              (
                { author, content, createdAt, likes, children: comments, _id },
                index
              ) => (
                <Post
                  key={index}
                  username={author?.username}
                  name={author?.name}
                  content={content}
                  createdAt={createdAt}
                  likes={likes?.length || 0}
                  replies={comments}
                  _id={_id}
                  containerClassName="max-w-2xl"
                />
              )
            )}
        </>
      )}
      {/* TODO: Include pagination */}
    </main>
  );
}
