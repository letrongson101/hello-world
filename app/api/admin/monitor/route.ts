import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const receipts = await prisma.receipt.findMany({ include: { participant: true }, orderBy: { amount: "desc" } });
  const top = receipts.slice(0, 10).map((r, i) => ({ rank: i + 1, name: r.participant.displayName, amount: r.amount, timestamp: r.createdAt }));
  return NextResponse.json({ claimed: receipts.length, top });
}
