import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./headless-schema";

declare global {
  // eslint-disable-next-line no-var
  var headlessPostgresClient: ReturnType<typeof postgres> | undefined;
}

export function getHeadlessDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the PostgreSQL headless CMS layer.");
  }

  const client = globalThis.headlessPostgresClient ?? postgres(databaseUrl, {
    max: Number(process.env.POSTGRES_POOL_MAX || 10),
    prepare: false,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.headlessPostgresClient = client;
  }

  return drizzle(client, { schema });
}
