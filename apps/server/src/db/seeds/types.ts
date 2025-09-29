import type { PgTable } from "drizzle-orm/pg-core";

export interface SeederData<T extends Record<string, unknown> = Record<string, unknown>> {
  tableName: string;
  records: T[];
  table: PgTable;
}

export interface Seeder<T extends Record<string, unknown> = Record<string, unknown>> {
  generate(): Promise<SeederData<T>>;
}
