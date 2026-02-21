import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
