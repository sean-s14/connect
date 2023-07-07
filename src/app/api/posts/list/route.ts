import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
import { IPost } from "@/constants/schemas/post";

export async function GET(request: Request) {
  try {
    await mongooseConnect();

    const posts = await Post.find(
      { isDeleted: false },
      "_id author content createdAt likes parent children"
    )
      .populate({
        path: "author",
        select: "name image username",
        model: User,
      })
      .populate("parent", "author content likes children createdAt", Post)
      .populate({
        path: "parent",
        populate: {
          path: "author",
          select: "name image username",
          model: User,
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Remove 'likes' from post fields and replace it with the number of likes
    posts.forEach((post) => {
      post.likes = post.likes.length;
      post.children = post.children.length || 0;
      if (post.parent) {
        post.parent.likes = post.parent.likes.length;
        post.parent.children = post.parent.children.length;
        if (post.parent.isDeleted) {
          post.parent.content = "deleted";
        }
      }
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" }, { status: 500 });
  }
}

// TODO: Implement POST, PATCH, and DELETE requests
