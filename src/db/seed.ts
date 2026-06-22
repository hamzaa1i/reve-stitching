import "dotenv/config";
import { getDb } from "./index";
import { users } from "./schema";
import { hashPassword } from "../lib/portal-auth";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();

  const adminEmail =
    process.env.PORTAL_ADMIN_EMAIL || "admin@revestitching.com";

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .get();
  if (existing) {
    console.log("Admin already exists:", adminEmail);
    process.exit(0);
  }

  const id = crypto.randomUUID();
  const adminPassword = process.env.PORTAL_ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    console.error("❌ PORTAL_ADMIN_PASSWORD env var is required (min 12 chars).");
    process.exit(1);
  }
  const passwordHash = await hashPassword(adminPassword);

  await db.insert(users).values({
    id,
    email: adminEmail,
    passwordHash,
    name: "Reve Admin",
    role: "admin",
    status: "active",
  });

  console.log(`✅ Admin created: ${adminEmail} (password read from env var)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
