import { getCachedData, deleteCache } from "../utils/cache";
import { drizzleDb, schema } from "../db";

export async function getUsers() {
  return getCachedData(
    "users",
    async () => {
      return drizzleDb.select().from(schema.users);
    },
    300
  );
}

export async function createUser(userData: any) {
  await drizzleDb.insert(schema.users).values(userData);
  await deleteCache("users");
}
