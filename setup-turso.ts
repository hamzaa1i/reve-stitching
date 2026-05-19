import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.TURSO_CONNECTION_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("URL:", url);

  if (!url || url.startsWith("file:")) {
    console.error("❌ TURSO_CONNECTION_URL is not set to a cloud URL.");
    console.error("   Update your .env file and try again.");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  // 1. Create all tables
  console.log("\n📦 Creating tables...");

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'client',
      status TEXT NOT NULL DEFAULT 'pending',
      avatar_url TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY NOT NULL,
      client_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      po_number TEXT NOT NULL,
      product_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price TEXT,
      total_price TEXT,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'confirmed',
      fabric_details TEXT,
      color TEXT,
      size_range TEXT,
      notes TEXT,
      estimated_completion INTEGER,
      actual_completion INTEGER,
      tracking_number TEXT,
      tracking_url TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS order_stages (
      id TEXT PRIMARY KEY NOT NULL,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      stage TEXT NOT NULL,
      notes TEXT,
      photo_url TEXT,
      created_by TEXT NOT NULL REFERENCES users(id),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY NOT NULL,
      order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
      client_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'other',
      filename TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size INTEGER,
      created_by TEXT NOT NULL REFERENCES users(id),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY NOT NULL,
      client_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_id TEXT REFERENCES orders(id),
      product_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price TEXT NOT NULL,
      total_price TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      fabric TEXT,
      color TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      valid_until INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY NOT NULL,
      order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL REFERENCES users(id),
      recipient_id TEXT NOT NULL REFERENCES users(id),
      subject TEXT,
      body TEXT NOT NULL,
      attachment_url TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);

  console.log("✅ Tables created");

  // 2. Verify tables
  const tables = await client.execute(
    `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`,
  );
  console.log("Tables:", tables.rows.map((r: any) => r.name).join(", "));

  // 3. Seed admin user
  console.log("\n👤 Seeding admin user...");

  const adminEmail =
    process.env.PORTAL_ADMIN_EMAIL || "admin@revestitching.com";
  const adminPassword = "ReveSt1tch!2025";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const adminId = crypto.randomUUID();

  const existing = await client.execute({
    sql: `SELECT id FROM users WHERE email = ?`,
    args: [adminEmail],
  });

  if (existing.rows.length > 0) {
    await client.execute({
      sql: `UPDATE users SET password_hash = ?, status = 'active', role = 'admin' WHERE email = ?`,
      args: [passwordHash, adminEmail],
    });
    console.log("✅ Admin password updated");
  } else {
    await client.execute({
      sql: `INSERT INTO users (id, email, password_hash, name, role, status) VALUES (?, ?, ?, 'Reve Admin', 'admin', 'active')`,
      args: [adminId, adminEmail, passwordHash],
    });
    console.log("✅ Admin created");
  }

  console.log("\n🎉 Setup complete!");
  console.log("   Email:", adminEmail);
  console.log("   Password:", adminPassword);
  console.log("\nChange the password after first login.");

  process.exit(0);
}

main().catch((e) => {
  console.error("\n❌ Setup failed:", e.message);
  process.exit(1);
});
