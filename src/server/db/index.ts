import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Check for database URL
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
}

// Create PostgreSQL connection
const client = postgres(process.env.DATABASE_URL);

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for type inference
export * from "./schema";
