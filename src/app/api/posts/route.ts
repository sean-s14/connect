import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
// import { faker } from "@faker-js/faker";

export async function GET(
  request: Request,
  { params }: { params: { [key: string]: string } }
) {
  try {
    await mongooseConnect();

    const post = await Post.findOne(params).populate(
      "author",
      "name profileImage username",
      User
    );

    return NextResponse.json({ post });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" }, { status: 500 });
  }
}

// TODO: Implement POST, PATCH, and DELETE requests

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
