import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await req.json() as { rows: { fullName: string; email?: string; employeeCode?: string }[] };
  await prisma.participant.deleteMany({ where: { eventId: 1 } });
  const data = rows.map((r, i) => ({
    uniqueId: r.employeeCode || r.email || `emp-${i}-${crypto.randomUUID()}`,
    displayName: r.fullName,
    email: r.email,
    token: crypto.randomBytes(18).toString("hex"),
    eventId: 1
  }));
  await prisma.participant.createMany({ data });
  return NextResponse.json({ count: data.length });
}
