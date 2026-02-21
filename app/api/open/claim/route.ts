import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mottos, titleByAmount } from "@/lib/mottos";
import { checkRateLimit } from "@/lib/rate-limit";

const randomOf = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export async function POST(req: Request) {
  const body = await req.json();
  const rateKey = `${body.uid || body.token || "anon"}`;
  if (!(await checkRateLimit(rateKey))) return NextResponse.json({ error: "Thao tác quá nhanh, chậm lại chút nha" }, { status: 429 });

  const event = await prisma.event.findUnique({ where: { id: 1 } });
  if (!event || event.status !== "ready") return NextResponse.json({ error: "Event chưa sẵn sàng" }, { status: 400 });

  const participant = event.mode === "MAGIC_LINK"
    ? await prisma.participant.findUnique({ where: { token: body.token }, include: { receipt: true } })
    : body.uid ? await prisma.participant.upsert({ where: { uniqueId: body.uid }, update: { displayName: body.name || "Ẩn danh" }, create: { uniqueId: body.uid, displayName: body.name || "Ẩn danh", eventId: 1 }, include: { receipt: true } }) : null;

  if (!participant) return NextResponse.json({ error: "Không xác định được danh tính" }, { status: 400 });
  if (participant.receipt) return NextResponse.json({ receipt: participant.receipt, alreadyClaimed: true });

  const result = await prisma.$transaction(async (tx) => {
    const available = await tx.envelope.findFirst({ where: { eventId: 1, claimedById: null } });
    if (!available) throw new Error("Hết phong bao");
    const motto = randomOf(mottos);
    const title = titleByAmount(available.amount, event.maxAmount, event.minAmount);
    await tx.envelope.update({ where: { id: available.id }, data: { claimedById: participant.id } });
    const receipt = await tx.receipt.create({ data: { participantId: participant.id, envelopeId: available.id, amount: available.amount, motto, title } });
    await tx.participant.update({ where: { id: participant.id }, data: { usedAt: new Date() } });
    return receipt;
  });

  return NextResponse.json({ receipt: result, alreadyClaimed: false });
}
