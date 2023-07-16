import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";

export async function GET(
  request: Request,
  { params }: { params: { user: string } }
) {
  try {
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const query = {
      username: { $regex: params.username, $options: "i" },
    };

    const users = await User.find(
      query,
      "_id name image username bio createdAt",
      { lean: true }
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" });
  }
}
