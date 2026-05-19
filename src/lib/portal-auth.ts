import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { getDb } from "../db/index";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = () => {
  const secret =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.JWT_SECRET
      : process.env.JWT_SECRET;
  return new TextEncoder().encode(secret || "fallback-dev-secret-change-me");
};
const SESSION_COOKIE = "portal_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// ━━━ Password ━━━
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ━━━ JWT ━━━
export async function createToken(payload: {
  sub: string;
  email: string;
  role: string;
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET());
}

export async function verifyToken(
  token: string,
): Promise<{ sub: string; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET());
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

// ━━━ Session ━━━
export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) throw new Error("User not found");

  const token = await createToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function validateSession(token: string): Promise<{
  user: typeof users.$inferSelect;
} | null> {
  const db = getDb();
  const payload = await verifyToken(token);
  if (!payload) return null;

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .get();
  if (!session) return null;
  if (new Date() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.sub))
    .get();
  if (!user || user.status !== "active") return null;

  return { user };
}

export async function deleteSession(token: string): Promise<void> {
  const db = getDb();
  await db.delete(sessions).where(eq(sessions.token, token));
}

// ━━━ Cookie helpers ━━━
export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function getSessionDuration(): number {
  return SESSION_DURATION;
}

// ━━━ User helpers ━━━
export async function getUserByEmail(email: string) {
  const db = getDb();
  return db.select().from(users).where(eq(users.email, email)).get();
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
  role?: "client" | "admin";
  status?: "pending" | "active" | "suspended";
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(data.password);

  const values: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    company: string | null;
    phone: string | null;
    role: "client" | "admin";
    status: "pending" | "active" | "suspended";
  } = {
    id,
    email: data.email,
    passwordHash,
    name: data.name,
    company: data.company || null,
    phone: data.phone || null,
    role: data.role || "client",
    status: data.status || "pending",
  };

  await db.insert(users).values(values);

  return db.select().from(users).where(eq(users.id, id)).get();
}
