import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookie = (await cookies()).get("admin_auth");
  return NextResponse.json({ authenticated: Boolean(cookie) });
}


