import "dotenv/config";
import { getDb } from "./index";
import { users } from "./schema";
import { hashPassword } from "../lib/portal-auth";
import { eq } from "drizzle-orm";

/**
 * Idempotent admin seeder — the ONLY seeder for this project (Phase 1 cleanup).
 *
 * Behavior:
 *   1. If no admin exists with PORTAL_ADMIN_EMAIL, create one.
 *   2. If an admin already exists, update the password hash (allows password
 *      rotation by re-running this script with a new PORTAL_ADMIN_PASSWORD).
 *
 * Required env vars:
 *   - PORTAL_ADMIN_PASSWORD (min 12 chars)
 *   - PORTAL_ADMIN_EMAIL (optional, defaults to admin@revestitching.com)
 */
async function seed() {
  const db = getDb();

  const adminEmail =
    process.env.PORTAL_ADMIN_EMAIL || "admin@revestitching.com";

  const adminPassword = process.env.PORTAL_ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    console.error("❌ PORTAL_ADMIN_PASSWORD env var is required (min 12 chars).");
    process.exit(1);
  }

  const passwordHash = await hashPassword(adminPassword);

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .get();

  if (existing) {
    // Idempotent update — allow password rotation by re-running seed.
    await db
      .update(users)
      .set({
        passwordHash,
        status: "active",
        role: "admin",
      })
      .where(eq(users.id, existing.id));
    console.log(`✅ Admin password updated for: ${adminEmail}`);
    process.exit(0);
  }

  // Create new admin
  const id = crypto.randomUUID();
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
