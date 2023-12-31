import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
import Follow from "@/schemas/follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";
import { IPostWithAuthorAndParent } from "@/types/post";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const page = parseInt(params.page as string) || 1;
    const limit = parseInt(params.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = {
      isDeleted: false,
    };

    if (params?.username) {
      var author = await User.findOne({ username: params.username }, "_id", {});
      if (!author) {
        return NextResponse.json({ err: "User not found!" }, { status: 404 });
      }
      query.author = author._id;
    } else if (params?.following === "true") {
      // Query posts only from users that the current user follows
      if (!session?.user?.id) {
        return NextResponse.json(
          { err: "You must be logged in to see your feed!" },
          { status: 401 }
        );
      }

      // Get the users that the current user follows
      let following = await Follow.find(
        { follower: session.user.id },
        "-_id following"
      ).lean();

      following = following.map((follow) => follow.following.toString());
      query.author = { $in: following };
    }

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

    // Remove posts without an author
    // TODO: This could mean less than the limit of posts are returned
    posts.filter((post) => post.author);

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
