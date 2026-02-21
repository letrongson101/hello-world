import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.event.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      nRecipients: 30,
      minAmount: 20000,
      maxAmount: 200000,
      avgTarget: 100000,
      avgTolerance: 0.1,
      roundTo: 10000,
      enableLeaderboard: true,
      leaderboardSize: 10,
      mode: "MAGIC_LINK",
      status: "draft"
    },
    update: {}
  });
}

main().finally(() => prisma.$disconnect());
