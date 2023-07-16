import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";
import Post from "@/schemas/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MongoDBAdapter from "@/config/mongoDBAdapter";
import mongoClientPromise from "@/config/mongoClient";
import { supabase } from "@/config/supabaseClient";
import getImageUrl from "@/utils/getImageUrl";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();
    const user = await User.findOne({ _id: session?.user?.id });
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Failed to retrieve user details!" });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();
    const body = await request.json();

    if (body?.image) {
      const user = await User.findOne({ _id: session?.user?.id });
      if (user?.image.includes("supabase")) {
        const image = user.image.split("profile-images/")[1];
        const { data, error } = await supabase.storage
          .from("profile-images")
          .remove([image]);
        if (error) {
          console.log(error);
        }
      }

      body.image = getImageUrl(body.image);
    }

    const user = await User.findOneAndUpdate(
      { _id: session?.user?.id },
      { ...body },
      { new: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Failed to update user" });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    if (session?.user?.id) {
      await User.deleteOne({ _id: session?.user?.id });
      await Post.deleteMany({ author: session?.user?.id });

      const adapter = MongoDBAdapter(mongoClientPromise);
      if (adapter.deleteUser) {
        adapter.deleteUser(session?.user?.id);
      }
    }

    return NextResponse.json({ msg: "Your account has been deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Failed to delete user" }, { status: 500 });
  }
}
