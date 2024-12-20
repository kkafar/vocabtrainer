import Database, { type Database as DatabaseType } from "better-sqlite3";
import { isStringBlank } from "../lib/text-util";

export default function createDatabaseConnection(): DatabaseType  {
  const dbPath = process.env.SQLITE_DB_PATH;

  if (dbPath == null || isStringBlank(dbPath)) {
    throw new Error("Invalid environment setup: missing SQLITE_DB_PATH env variable");
  }

  return new Database(dbPath);
}

