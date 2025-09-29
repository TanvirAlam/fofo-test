import * as seeders from "./data";
import { drizzleDb } from "../index";
import { logger } from "../../utils/logger";
import type { SeederData, Seeder } from "./types";

const clearTable = async (data: SeederData): Promise<void> => {
  try {
    await drizzleDb.execute(
      `TRUNCATE TABLE ${data.tableName} RESTART IDENTITY CASCADE`
    );
    logger.info(`✅ Truncated ${data.tableName} table with CASCADE`);
    await verifyTableRecords(data);
  } catch (error) {
    logger.error(`❌ Failed to clear ${data.tableName} table:`, error);
    throw error;
  }
};

const verifyTableRecords = async (data: SeederData): Promise<void> => {
  try {
    const count = await drizzleDb.select().from(data.table);
    logger.info(
      `✅ Verification: ${count.length} records found in ${data.tableName}`
    );
  } catch (error) {
    logger.error(`❌ Failed to verify records in ${data.tableName}:`, error);
    throw error;
  }
};

const insertSeedData = async (data: SeederData): Promise<void> => {
  try {
    await drizzleDb.insert(data.table).values(data.records);
    logger.info(
      `✅ Inserted ${data.records.length} records into ${data.tableName}`
    );

    await verifyTableRecords(data);
  } catch (error) {
    logger.error(`❌ Failed to insert records into ${data.tableName}:`, error);
    throw error;
  }
};

const runSeeding = async (): Promise<void> => {
  try {
    logger.info("🌱 Starting database seeding...");

    const seederList = Object.values(seeders) as Seeder[];

    for (const seeder of seederList) {
      const seedData = await seeder.generate();

      logger.info(`📋 Processing ${seedData.tableName}...`);
      await clearTable(seedData);
      await insertSeedData(seedData);
    }

    logger.info("🎉 Database seeding completed successfully!");
  } catch (error) {
    logger.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await drizzleDb.$client.end();
    process.exit(0);
  }
};

runSeeding();
