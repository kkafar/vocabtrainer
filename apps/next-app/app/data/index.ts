import { isStringBlank } from "@/app/lib/text-util";
import { DataRepository } from "./repository";
import { SqliteRepository } from "./sqlite-repository";

export { type DataRepository } from './repository';
export { SqliteRepository } from './sqlite-repository';

export function getDataRepository(): DataRepository {
  const dbPath = process.env.SQLITE_DB_PATH;

  if (dbPath == null || isStringBlank(dbPath)) {
    throw new Error("Invalid environment setup: missing SQLITE_DB_PATH env variable");
  }

  return new SqliteRepository(dbPath);
}

