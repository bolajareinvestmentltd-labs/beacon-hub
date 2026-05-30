import { Client } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL not set in environment");
    process.exit(1);
  }

  console.log("Using DATABASE_URL:", dbUrl.substring(0, 20) + "...");

  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Read the migration file
    const migrationPath = path.join(process.cwd(), "drizzle/0000_odd_dark_phoenix.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split by statement breakpoint
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`Running ${statements.length} migration statements...\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      console.log(`[${i + 1}/${statements.length}] Executing statement...`);
      try {
        await client.query(statements[i]);
        console.log(`✓ Statement ${i + 1} completed`);
      } catch (err) {
        // If error is about table already existing, continue
        if (err.message.includes("already exists")) {
          console.log(`⚠ Statement ${i + 1} skipped (already exists)`);
        } else {
          console.error(`✗ Statement ${i + 1} failed:`, err.message);
          throw err;
        }
      }
    }

    console.log("\n✓ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:");
    console.error("Error:", error);
    if (error.stack) console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
