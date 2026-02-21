import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const event = await prisma.event.findUnique({ where: { id: 1 } });
  return NextResponse.json(event);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const event = await prisma.event.upsert({
    where: { id: 1 },
    create: { ...body, id: 1 },
    update: body
  });
  return NextResponse.json(event);
}
