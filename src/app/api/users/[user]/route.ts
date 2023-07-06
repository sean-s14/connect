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
      "_id content likes parent children createdAt"
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
      })
      .lean();

    // Replace 'likes' from each post with the number of likes
    posts.forEach((post) => {
      post.likes = post.likes.length;
      post.children = post.children.length;
      if (post.parent) {
        post.parent.likes = post.parent.likes.length;
        post.parent.children = post.parent.children.length;
        if (post.parent.isDeleted) {
          post.parent.content = "deleted";
        }
      }
    });

    user.posts = posts;

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" });
  }
}
