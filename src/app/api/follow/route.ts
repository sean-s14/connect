import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import Follow from "@/schemas/follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    console.log("GET - /api/follow -", params);

    const followerCount = await Follow.find({ following: params.id })
      .distinct("follower")
      .countDocuments();

    const followingCount = await Follow.find({ follower: params.id })
      .distinct("following")
      .countDocuments();

    // Check if the user is following the profile
    let following = false;
    if (session?.user?.id) {
      following = (await Follow.exists({
        follower: session.user.id,
        following: params.id,
      }))
        ? true
        : false;
    }

    return NextResponse.json(
      { followerCount, followingCount, following },
      { status: 200 }
    );
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

    // Check if the user is already following the profile
    if (session?.user?.id) {
      const following = await Follow.exists({
        follower: session.user.id,
        following: body.id,
      });
      if (following) {
        return NextResponse.json(
          { err: "Already following!" },
          { status: 400 }
        );
      }
    }

    const follow = await Follow.create({
      follower: session?.user?.id,
      following: body.id,
    });

    if (!follow) {
      return NextResponse.json(
        { err: "Follow request failed!" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { followed: true, msg: "Follow request successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { err: "Follow request failed!" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await mongooseConnect();

    if (!session?.user?.id) {
      return NextResponse.json(
        { err: "Unfollow request failed!" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // Check if the user is following the profile
    const following = (await Follow.exists({
      follower: session.user.id,
      following: params.id,
    }))
      ? true
      : false;

    if (following) {
      const follow = await Follow.findOneAndDelete({
        follower: session.user.id,
        following: params.id,
      });

      if (!follow) {
        return NextResponse.json(
          { err: "Unfollow request failed!" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { unfollowed: true, msg: "Unfollow request successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { err: "Unfollow request failed!" },
      { status: 500 }
    );
  }
}
