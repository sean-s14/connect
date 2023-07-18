import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const isAdult = cookieStore.get("isAdult")?.value === "true";
    return NextResponse.json({ isAdult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { age } = await request.json();
    const isAdult = age >= 18;
    cookies().set("isAdult", isAdult.toString(), {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ isAdult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
