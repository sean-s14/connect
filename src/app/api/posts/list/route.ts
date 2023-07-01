import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";

export async function GET(request: Request) {
  try {
    await mongooseConnect();

    const posts = await Post.find(
      {},
      "_id author content createdAt likes parent children"
    ).populate({
      path: "author",
      select: "name profileImage username",
      model: User,
    });
    // TODO: Remove 'likes' from post fields and replace it with the number of likes

    return NextResponse.json({ posts });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" }, { status: 500 });
  }
}

// TODO: Implement POST, PATCH, and DELETE requests
