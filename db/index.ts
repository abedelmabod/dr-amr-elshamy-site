import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type WorkerEnv = {
  DB?: Parameters<typeof drizzle>[0];
};

export async function getDrizzleDb() {
  try {
    const module = await import("cloudflare:workers");
    const env = (module as { env?: WorkerEnv }).env;
    if (env?.DB) {
      return drizzle(env.DB, { schema });
    }
  } catch {
    // Ubuntu VPS routes use app/api/_lib.ts, which provides the local SQLite fallback.
  }

  throw new Error("Drizzle D1 binding is unavailable in this runtime.");
}
