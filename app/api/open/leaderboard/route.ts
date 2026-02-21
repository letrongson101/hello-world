import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const event = await prisma.event.findUnique({ where: { id: 1 } });
  if (!event?.enableLeaderboard) return NextResponse.json([]);
  const receipts = await prisma.receipt.findMany({ include: { participant: true }, orderBy: [{ amount: "desc" }, { createdAt: "asc" }], take: event.leaderboardSize });
  return NextResponse.json(receipts.map((r, i) => ({ rank: i + 1, name: event.maskName ? `${r.participant.displayName.slice(0, 1)}***` : r.participant.displayName, amount: r.amount, timestamp: r.createdAt })));
}
