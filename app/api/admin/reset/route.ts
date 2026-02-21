import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.$transaction([
    prisma.receipt.deleteMany({}),
    prisma.envelope.deleteMany({ where: { eventId: 1 } }),
    prisma.participant.deleteMany({ where: { eventId: 1 } }),
    prisma.event.update({ where: { id: 1 }, data: { status: "draft" } })
  ]);
  return NextResponse.json({ ok: true });
}
