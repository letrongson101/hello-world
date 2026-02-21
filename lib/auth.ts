import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "admin_session";

export async function createAdminSession() {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12);
  await prisma.adminSession.create({ data: { token, expiresAt } });
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) return false;
  return true;
}
