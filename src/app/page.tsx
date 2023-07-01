"use client";

import { useState, useEffect } from "react";
import { IPost } from "@/constants/schemas/post";
// import feedTestData from "@/app/data.posts.json";
import { IUser } from "@/constants/schemas/user";
import Post from "@/components/post";

interface IPostWithAuthor extends Omit<IPost, "author"> {
  _id: string;
  author: IUser;
}

export default function Home() {
  const [feed, setFeed] = useState<IPostWithAuthor[]>([]);

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

  return (
    <main className="py-8 px-10 flex flex-col gap-10 items-center">
      {Array.isArray(feed) &&
        feed.map(
          (
            {
              author: { username, name },
              content,
              createdAt,
              likes,
              children: comments,
              _id,
            },
            index
          ) => (
            <Post
              key={index}
              username={username}
              name={name}
              content={content}
              createdAt={createdAt}
              likes={likes?.length || 0}
              replies={comments}
              _id={_id}
            />
          )
        )}
      {/* TODO: Include pagination */}
    </main>
  );
}
