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
    const connectionUrl = getEnv("TURSO_CONNECTION_URL");

    // Force an early crash with an explanation if keys are missing
    if (!connectionUrl) {
      throw new Error(
        "CRITICAL: TURSO_CONNECTION_URL is missing from your environment variables!",
      );
    }

    _client = createClient({
      url: connectionUrl,
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
