#!/usr/bin/env ts-node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { DatabaseService } from '../db/drizzle';
import { logger } from '../utils/logger';

interface Migration {
  filename: string;
  sql: string;
}

async function runMigrations() {
  const db = DatabaseService.getInstance();

  try {
    logger.info('Starting database migrations...');

    // Create migrations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Get list of executed migrations
    const executedResult = await db.query(
      'SELECT filename FROM migrations ORDER BY id'
    );
    const executedMigrations = new Set(
      executedResult.rows.map(row => row.filename)
    );

    // Get all migration files
    const migrationsDir = join(__dirname, '../../migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const pendingMigrations: Migration[] = migrationFiles
      .filter(filename => !executedMigrations.has(filename))
      .map(filename => ({
        filename,
        sql: readFileSync(join(migrationsDir, filename), 'utf8'),
      }));

    if (pendingMigrations.length === 0) {
      logger.info('No pending migrations.');
      return;
    }

    logger.info(`Found ${pendingMigrations.length} pending migration(s).`);

    // Execute each migration
    for (const migration of pendingMigrations) {
      logger.info(`Executing migration: ${migration.filename}`);

      // Start transaction
      const client = await db.getPool().connect();

      try {
        await client.query('BEGIN');

        // Execute migration SQL
        await client.query(migration.sql);

        // Record migration as executed
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [
          migration.filename,
        ]);

        await client.query('COMMIT');

        logger.info(`Successfully executed migration: ${migration.filename}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    logger.info('All migrations completed successfully.');
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations();
}
