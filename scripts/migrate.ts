import { getConnection } from "@/lib/db";
import path from "path";
import fs from "fs";
import { loadEnvConfig } from "@next/env";
import { Connection } from "mysql2/promise";

loadEnvConfig(process.cwd());

async function ensureMigrationTable(connection: Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id VARCHAR(255) PRIMARY KEY,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function runMigrations() {
  const connection = await getConnection();

  ensureMigrationTable(connection);
  const [rows] = await connection.execute("SELECT id FROM migrations");
  const completed = new Set(rows.map((row) => row.id));

  const migrationsDir = path.join(process.cwd(), "migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!completed.has(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await connection.execute(sql);
      await connection.execute("INSERT INTO migrations (id) VALUES (?)", [
        file,
      ]);
    }
  }

  await connection.end();
}

runMigrations();
