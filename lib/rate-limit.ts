import { prisma } from "@/lib/prisma";

export async function checkRateLimit(key: string, limit = 6) {
  const now = new Date();
  const windowAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  const row = await prisma.claimLog.upsert({
    where: { key_windowAt: { key, windowAt } },
    create: { key, windowAt, count: 1 },
    update: { count: { increment: 1 } }
  });
  return row.count <= limit;
}
