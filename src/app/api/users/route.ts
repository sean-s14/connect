import { NextResponse } from "next/server";
import mongooseConnect from "@/config/mongooseConnect";
import User from "@/schemas/user";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await mongooseConnect();

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    // implement pagination
    const page = parseInt(params?.page) || 1;
    const limit = parseInt(params?.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      ...(params?.username && {
        username: { $regex: params.username, $options: "i" },
      }),
    };

    const users = await User.find(
      query,
      "_id name image username bio createdAt",
      { lean: true }
    )
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: "Get request failed!" });
  }
}
