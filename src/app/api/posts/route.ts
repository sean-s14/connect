import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";
import { ObjectId } from "mongoose";
// import { faker } from "@faker-js/faker";
import { IPostWithAuthorAndParent } from "@/types/post";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const post: IPostWithAuthorAndParent | null = await Post.findOne(params)
      .select("_id author content isDeleted likes parent children createdAt")
      .populate("author", "name image username", User)
      .populate({
        path: "parent",
        select: "_id author content isDeleted likes children createdAt",
        model: Post,
        populate: {
          path: "author",
          select: "name image username",
          model: User,
        },
      })
      .populate({
        path: "children",
        select: "_id author content isDeleted likes children createdAt",
        populate: {
          path: "author",
          select: "name image username",
          model: User,
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!post) {
      return NextResponse.json({ err: "Post not found!" }, { status: 404 });
    }

    const authorId = session?.user?.id;

    // Post
    if (authorId) {
      post.liked = post?.likes
        ?.map((like: Types.ObjectId) => like.toString())
        .includes(authorId);
    } else {
      post.liked = false;
    }
    post.likeCount = post?.likes?.length ?? 0;
    delete post.likes;
    if (post.isDeleted) {
      post.content = "deleted";
    }

    // Post Parent
    if (post.parent) {
      if (authorId) {
        post.parent.liked =
          post.parent?.likes
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

    // Post Children
    post.replyCount = post?.children?.length ?? 0;
    post.replies =
      post?.children?.map((child: any) => {
        if (authorId) {
          child.liked = child.likes
            .map((like: ObjectId) => like.toString())
            .includes(authorId);
        } else {
          child.liked = false;
        }
        child.likeCount = child.likes.length;
        delete child.likes;
        child.replyCount = child.children.length;
        delete child.children;
        if (child.isDeleted) {
          child.content = "deleted";
        }
        return child;
      }) ?? [];

    return NextResponse.json({ post });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();
    const body = await request.json();

    const author = session?.user?.id;
    if (!author) {
      return NextResponse.json({ err: "Not authorized!" }, { status: 401 });
    }

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    if (params?.parentId) {
      const parentPost = await Post.findOne({ _id: params?.parentId });
      if (parentPost?.isDeleted) {
        return NextResponse.json(
          { err: "Parent post is deleted!" },
          { status: 400 }
        );
      }
      body.parent = [params.parentId];
    }

    let post = await Post.create({ ...body, author });
    post = await post.populate("author", "name image username");

    if (params?.parentId) {
      const parentPost = await Post.findOneAndUpdate(
        { _id: params.parentId },
        { $push: { children: post._id } }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Post request failed!" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();
    let body = await request.json();
    let filter = { _id: params?._id };
    let options = { new: true };

    const author = session?.user?.id;
    if (!author) {
      return NextResponse.json({ err: "Not authorized!" }, { status: 401 });
    }

    // If parameters containes like=true, then retrieve the post
    // Check if the user has already liked the post
    // If yes, then add the user to the likes array
    // If no, then remove the user from the likes array
    // Finally, save and return the post
    if (params?.like === "true") {
      const post = await Post.findOne({ _id: params?._id });

      if (post?.likes?.includes(author)) {
        post.likes = post.likes.filter(
          (_id: Types.ObjectId) => _id.toString() !== author
        );
        post.save();
      } else {
        post.likes.push(author);
        post.save();
      }

      const liked =
        post?.likes?.map((like: Types.ObjectId) => like.toString() === author)
          .length > 0;
      const likeCount = post?.likes?.length ?? 0;

      return NextResponse.json({
        post: { liked, likeCount },
      });
    }

    const post = await Post.findOneAndUpdate(filter, body, options);

    return NextResponse.json({ post });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { err: "Update request failed!" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    const author = session?.user?.id;
    if (!author) {
      return NextResponse.json({ err: "Not authorized!" }, { status: 401 });
    }

    let filter = { _id: params?._id, author };
    let body = { isDeleted: true, deletedAt: new Date() };
    const post = await Post.findOneAndUpdate(filter, body);

    return NextResponse.json({ msg: "Delete request successful!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { err: "Delete request failed!" },
      { status: 500 }
    );
  }
}

// async function createPostsForUser(userId: string) {
//   const numPosts = Math.floor(Math.random() * 3) + 1; // Generate a random number between 1 and 3

//   for (let i = 0; i < numPosts; i++) {
//     const newPost = new Post({
//       author: userId,
//       content: faker.lorem.paragraph(), // Generate random post content
//     });

//     await newPost.save(); // Save the post to the database
//   }
// }

// export async function POST(request: Request) {
//   try {
//     await mongooseConnect();
//     // const post = await Post.create()

//     const userIds = [
//       "649c7ce41d78f340dbcaea24",
//       "649edb32be6076eb5724fc19",
//       "64a05cd759e58dae6d2784f0",
//       "64a05d1f59e58dae6d2784f6",
//     ];

//     // userIds.forEach((userId) => {
//     //   createPostsForUser(userId);
//     // });

//     return NextResponse.json({ msg: "Post request successful!" });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ err: "Post request failed!" });
//   }
// }
