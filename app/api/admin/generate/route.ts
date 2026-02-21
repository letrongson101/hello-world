import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAmounts, summarize, validateConfig } from "@/lib/generator";

export async function POST() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const event = await prisma.event.findUnique({ where: { id: 1 } });
  if (!event) return NextResponse.json({ error: "Chưa setup event" }, { status: 400 });
  const err = validateConfig({ n: event.nRecipients, min: event.minAmount, max: event.maxAmount, avgTarget: event.avgTarget, tolerance: event.avgTolerance, roundTo: event.roundTo });
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  const values = generateAmounts({ n: event.nRecipients, min: event.minAmount, max: event.maxAmount, avgTarget: event.avgTarget, tolerance: event.avgTolerance, roundTo: event.roundTo });
  await prisma.$transaction([
    prisma.receipt.deleteMany({}),
    prisma.envelope.deleteMany({ where: { eventId: 1 } }),
    prisma.envelope.createMany({ data: values.map((amount) => ({ amount, eventId: 1 })) }),
    prisma.event.update({ where: { id: 1 }, data: { status: "ready" } })
  ]);
  return NextResponse.json({ summary: summarize(values), values });
}
