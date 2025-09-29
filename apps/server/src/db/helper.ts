import type { Pool, QueryConfig, QueryResult } from "pg";
import { sql } from "drizzle-orm";
import { drizzleDb, pool } from "./drizzle";
import { logger } from "../utils/logger";

export async function connectDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    logger.info("DB connected ✅");
  } finally {
    client.release();
  }
}

export async function disconnectDatabase(): Promise<void> {
  await pool.end();
  logger.info("DB disconnected ✅");
}

export interface HealthCheckResult {
  ok: boolean;
  latencyMs: number;
  error?: string;
}

export async function healthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    await drizzleDb.execute(sql`SELECT 1`);
    return {
      ok: true,
      latencyMs: Date.now() - startTime,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    return {
      ok: false,
      error: message,
      latencyMs: Date.now() - startTime,
    };
  }
}

export interface TableStats {
  table_name: string;
  row_count: number;
  dead_tuples: number;
}

export async function getTableStats(): Promise<TableStats[]> {
  try {
    const result = await drizzleDb.execute(sql`
      SELECT relname AS table_name,
             n_live_tup AS row_count,
             n_dead_tup AS dead_tuples
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC;
    `);

    return result.rows.map(row => ({
      table_name: String(row.table_name),
      row_count: Number(row.row_count),
      dead_tuples: Number(row.dead_tuples),
    })) as TableStats[];
  } catch (err) {
    logger.error("Failed to fetch table stats", { err });
    return [];
  }
}

type QueryInput = string | QueryConfig<any[]>;

function normalizeQuery(
  query: QueryInput,
  values?: unknown[],
): { text: string; values: unknown[] } {
  if (typeof query === "string") {
    return { text: query, values: values ?? [] };
  }
  return { text: query.text ?? "", values: query.values ?? [] };
}

export function attachSqlLogger(pool: Pool): void {
  const originalQuery = pool.query.bind(pool) as (
    query: QueryInput,
    values?: unknown[],
  ) => Promise<QueryResult>;

  pool.query = (async (
    query: QueryInput,
    values?: unknown[],
  ): Promise<QueryResult> => {
    const { text: sqlText, values: sqlParams } = normalizeQuery(query, values);
    const startTime = Date.now();

    try {
      const result = await originalQuery(query, values);
      const durationMs = Date.now() - startTime;

      if (process.env.NODE_ENV === "development") {
        console.debug(`[SQL] ${sqlText} — ${durationMs}ms`, sqlParams);
      }

      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      console.error(
        `[SQL FAILED] ${sqlText} — ${durationMs}ms`,
        sqlParams,
        error,
      );
      throw error;
    }
  }) as typeof pool.query;
}
