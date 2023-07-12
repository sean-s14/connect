import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";
import { IPostWithAuthorAndParent } from "@/types/post";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const page = parseInt(params.page as string) || 1;
    const limit = parseInt(params.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (params?.username) {
      var author = await User.findOne({ username: params.username }, "_id", {});
      if (!author) {
        return NextResponse.json({ err: "User not found!" }, { status: 404 });
      }
    }

    const query = {
      isDeleted: false,
      ...(author && { author: author._id }),
    };

    // TODO: Exclude posts who dont have an author
    const posts: IPostWithAuthorAndParent[] = await Post.find(
      query,
      "_id author content createdAt likes parent children"
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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
      .lean();

    const authorId = session?.user?.id;

    posts.forEach((post) => {
      if (authorId) {
        post.liked =
          post?.likes
            ?.map((like: Types.ObjectId) => like.toString())
            .includes(authorId) ?? false;
      } else {
        post.liked = false;
      }

      post.likeCount = post?.likes?.length ?? 0;
      delete post.likes;
      post.replyCount = post?.children?.length ?? 0;
      delete post.children;
      if (post.parent) {
        if (authorId) {
          post.parent.liked =
            post?.parent?.likes
              ?.map((like: Types.ObjectId) => like.toString())
              .includes(authorId) ?? false;
        } else {
          post.parent.liked = false;
        }
        post.parent.likeCount = post.parent?.likes?.length ?? 0;
        delete post.parent.likes;
        post.parent.replyCount = post.parent?.children?.length ?? 0;
        delete post.parent.children;
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
