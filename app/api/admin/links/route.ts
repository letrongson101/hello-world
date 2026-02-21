import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await prisma.participant.findMany({ where: { eventId: 1 }, select: { displayName: true, email: true, token: true } });
  return NextResponse.json(rows);
}
