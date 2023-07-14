"use client";

import { useState } from "react";
import Input from "@/components/form/input";
import { AiOutlineSend } from "react-icons/ai";
import { IPostWithAuthorAndParent } from "@/types/post";

export default function NewPost(props: {
  onPostCreated: (post: IPostWithAuthorAndParent) => void;
  containerClassName?: string;
}) {
  const [newPost, setNewPost] = useState("");

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
        const { post }: { post: IPostWithAuthorAndParent } = data;
        props.onPostCreated(post);
        setNewPost("");
      })
      .catch((err) => console.log(err));
  }

  return (
    <form
      onSubmit={handleCreatePost}
      className={`bg-slate-800 border-solid border-2 border-slate-700 rounded-xl w-full max-w-2xl p-3 flex gap-4 items-center justify-around ${props?.containerClassName}`}
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
  );
}
