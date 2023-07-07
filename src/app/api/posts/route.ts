import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";
// import { faker } from "@faker-js/faker";

export async function GET(request: Request) {
  try {
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const post: any = await Post.findOne(params)
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

    // Post
    post.likes = post.likes.length;
    if (post.isDeleted) {
      post.content = "deleted";
    }

    // Post Parent
    if (post.parent) {
      post.parent.likes = post.parent.likes.length;
      post.parent.children = post.parent.children.length;
      if (post.parent.isDeleted) {
        post.parent.content = "deleted";
      }
    }

    // Post Children
    post.children.map((child: any) => {
      if (child.isDeleted) {
        child.content = "deleted";
      }
      child.likes = child.likes.length;
      child.children = child.children.length;
      return child;
    });

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
      body.parent = [params.parentId];
    }

    const post = await Post.create({ ...body, author });

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

      return NextResponse.json({ post });
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
