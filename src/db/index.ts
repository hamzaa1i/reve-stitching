import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import * as schema from "./schema";

let _client: Client | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

// Works inside Astro (import.meta.env) AND outside (process.env)
function getEnv(key: string, fallback?: string): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  return process.env[key] || fallback;
}

export function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: getEnv("TURSO_CONNECTION_URL", "file:portal.db")!,
      authToken: getEnv("TURSO_AUTH_TOKEN") || undefined,
    });
  }
  return _client;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getClient(), { schema });
  }
  return _db;
}
