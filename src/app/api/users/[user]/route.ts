import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";

export async function GET(
  request: Request,
  { params }: { params: { user: string } }
) {
  try {
    await mongooseConnect();

    const user = await User.findOne(
      { username: params.user },
      "_id name image username bio createdAt",
      { lean: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" });
  }
}
