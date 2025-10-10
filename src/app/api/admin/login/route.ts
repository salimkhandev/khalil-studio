import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as { username?: string; password?: string };
  if (!username || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

  await connectToDatabase();
  const user = await User.findOne({ username }).lean<{ username: string; password: string }>();
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Set a httpOnly cookie for simple auth
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });
  return res;
}


