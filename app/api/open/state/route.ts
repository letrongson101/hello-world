import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getIdentity(url: URL) {
  const token = url.searchParams.get("token") || undefined;
  const uid = url.searchParams.get("uid") || undefined;
  const name = url.searchParams.get("name") || undefined;
  return { token, uid, name };
}

export async function GET(req: Request) {
  const event = await prisma.event.findUnique({ where: { id: 1 } });
  if (!event) return NextResponse.json({ error: "Event chưa setup" }, { status: 400 });
  const identity = getIdentity(new URL(req.url));
  let participant = null;
  if (event.mode === "MAGIC_LINK") {
    participant = identity.token ? await prisma.participant.findUnique({ where: { token: identity.token }, include: { receipt: true } }) : null;
  } else if (identity.uid && identity.name) {
    participant = await prisma.participant.upsert({
      where: { uniqueId: identity.uid },
      update: { displayName: identity.name },
      create: { uniqueId: identity.uid, displayName: identity.name, eventId: 1 },
      include: { receipt: true }
    });
  }
  return NextResponse.json({
    event: { mode: event.mode, enableLeaderboard: event.enableLeaderboard, leaderboardSize: event.leaderboardSize, shareAmount: event.shareAmount, status: event.status },
    participant
  });
}
