import Database, { type Database as DatabaseType, type Statement as StatementType } from "better-sqlite3";
import { isStringBlank } from "../lib/text-util";
import { VocabularyItemGroupWoId, VocabularyItemWoId } from "../lib/definitions";

export interface DataRepository {
  insertAllIntoVocabulary(items: Array<VocabularyItemWoId>): void;
  insertAllIntoGroups(groups: Array<VocabularyItemGroupWoId>): void;
  insertIntoVocabulary(item: VocabularyItemWoId): void;
  insertIntoGroups(group: VocabularyItemGroupWoId): void;

  // These should be moved from this interface later (so that these methods are not public)
  createSchema(): void;
}

export default function createDatabaseConnection(): DatabaseType {
  const dbPath = process.env.SQLITE_DB_PATH;

  if (dbPath == null || isStringBlank(dbPath)) {
    throw new Error("Invalid environment setup: missing SQLITE_DB_PATH env variable");
  }

  return new Database(dbPath);
}

export function getDataRepository(): DataRepository {
  const dbPath = process.env.SQLITE_DB_PATH;

  if (dbPath == null || isStringBlank(dbPath)) {
    throw new Error("Invalid environment setup: missing SQLITE_DB_PATH env variable");
  }

  return new SqliteRepository(dbPath);
}

class SqliteRepository implements DataRepository {
  private path: string
  private conn: DatabaseType

  constructor(path: string) {
    if (path == null || isStringBlank(path)) {
      throw new Error("Nullish or empty path to db");
    }

    this.path = path;
    this.conn = this.createDatabaseConnection();
  }

  public insertIntoVocabulary(vocabularyItem: VocabularyItemWoId) {
    this.prepareInsertIntoVocabularyStmt().run(vocabularyItem);
  }

  public insertAllIntoVocabulary(vocabularyItems: Array<VocabularyItemWoId>) {
    this.insertAllInSingleTransaction(this.prepareInsertIntoVocabularyStmt(), vocabularyItems);
  }

  public insertIntoGroups(group: VocabularyItemGroupWoId) {
    this.prepareInsertIntoGroupsStmt().run(group);
  }

  public insertAllIntoGroups(groups: Array<VocabularyItemGroupWoId>) {
    this.insertAllInSingleTransaction(this.prepareInsertIntoGroupsStmt(), groups);
  }

  private prepareInsertIntoVocabularyStmt(): StatementType<[VocabularyItemWoId]> {
    return this.conn.prepare<VocabularyItemWoId>(this.insertIntoVocabularyStmt());
  }

  private prepareInsertIntoGroupsStmt(): StatementType<[VocabularyItemGroupWoId]> {
    return this.conn.prepare<VocabularyItemGroupWoId>(this.insertIntoGroupsStmt());
  }

  private insertIntoVocabularyStmt(): string {
    return "INSERT INTO vocabulary (text, translation, created_date, last_updated_date) VALUES ($text, $translation, $createdDate, $lastUpdatedDate);"
  }

  private insertIntoGroupsStmt(): string {
    return "INSERT INTO groups (name, description, created_date) VALUES ($name, $description, $createdDate);";
  }

  private createDatabaseConnection(): DatabaseType {
    return new Database(this.path);
  }

  private insertAllInSingleTransaction<RowT>(statement: StatementType<[RowT], unknown>, rows: RowT[]) {
    this.conn.transaction((items: typeof rows) => {
      items.forEach(item => statement.run(item));
    })(rows);
  }

  public createSchema(): void {
    this.createVocabularyTable();
    this.createGroupsTable();
    this.createVocabularyGroupingTable();
    this.createVocabularyStatsTable();
    this.createGameSessionTable();
    this.createGameSessionItemsTable();
    this.createGameSessionCurrentItemTable();
  }

  /**
  * Throws on failure
  */
  private createVocabularyTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL UNIQUE CHECK (length(text) > 0),
        translation TEXT,
        created_date TEXT NOT NULL,
        last_updated_date TEXT NOT NULL
      );
    `);
    createTableStmt.run();
  }

  private createGroupsTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE CHECK (length(name) > 0),
        description TEXT,
        created_date TEXT NOT NULL
      );
    `);
    createTableStmt.run();
  }

  private createVocabularyGroupingTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS vocabulary_grouping (
        item_id INTEGER,
        group_id INTEGER,
        PRIMARY KEY (item_id, group_id),
        FOREIGN KEY (item_id) REFERENCES vocabulary (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES groups (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
    createTableStmt.run();
  }

  private createVocabularyStatsTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS vocabulary_stats (
        item_id INTEGER NOT NULL,
        reversed INTEGER NOT NULL,
        hit_count INTEGER NOT NULL DEFAULT 0,
        miss_count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (item_id, reversed),
        FOREIGN KEY (item_id) REFERENCES vocabulary (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
    createTableStmt.run();
  }

  private createGameSessionTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS game_session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_date TEXT NOT NULL,
        expiration_date TEXT,
        description TEXT
      );
    `);
    createTableStmt.run();
  }

  private createGameSessionItemsTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS game_session_items (
        session_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        learned INTEGER NOT NULL,
        ordering INTEGER NOT NULL,
        PRIMARY KEY (session_id, item_id),
        FOREIGN KEY (session_id) REFERENCES game_session (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES vocabulary (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
    createTableStmt.run();
  }

  private createGameSessionCurrentItemTable() {
    const createTableStmt = this.conn.prepare(`
      CREATE TABLE IF NOT EXISTS game_session_current_item (
        session_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        PRIMARY KEY (session_id, item_id),
        FOREIGN KEY (session_id) REFERENCES game_session (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES vocabulary (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
    `);
    createTableStmt.run();
  }
}
