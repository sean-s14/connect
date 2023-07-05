import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";

export async function GET(
  request: Request,
  { params }: { params: { user: string } }
) {
  try {
    await mongooseConnect();

    const user = await User.findOne(
      { username: params.user },
      "_id name profileImage username bio createdAt",
      { lean: true }
    );

    // TODO: Include pagination for posts
    const posts = await Post.find(
      { author: user._id, isDeleted: false },
      "_id content createdAt likes children"
    )
      .sort({ createdAt: -1 })
      .populate({
        path: "parent",
        select: "_id author content isDeleted likes children createdAt",
        model: Post,
        populate: {
          path: "author",
          select: "name profileImage username",
          model: User,
        },
      });

    // TODO: Swap 'likes' from each post with the number of likes

    user.posts = posts;

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" });
  }
}
