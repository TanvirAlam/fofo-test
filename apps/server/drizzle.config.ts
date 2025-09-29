import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  // Database driver and connection
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/foodime_db',
  },
  
  // Schema files location - you'll need to create these
  schema: './src/db/schema/*.ts',
  
  // Output directory for migrations
  out: './src/db/migrations',
  
  // Verbose logging
  verbose: true,
  
  // Strict mode for safer migrations
  strict: true,
});
