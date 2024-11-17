import Database, { type Database as DatabaseType } from "better-sqlite3";

export default function createDatabaseConnection(): DatabaseType  {
  const dbPath = process.env.SQLITE_DB_PATH;

  if (dbPath == null) {
    throw new Error("Invalid environment setup: missing SQLITE_DB_PATH env variable");
  }

  return new Database(dbPath);
}

