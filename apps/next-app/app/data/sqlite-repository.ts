import { isStringBlank } from "@/app/lib/text-util";
import { DataRepository } from "./repository";
import Database, { type Database as DatabaseType, type Statement as StatementType } from "better-sqlite3";
import { TableVocabularyAttributes, TableVocabularyGroupingAttributes, VocabularyGrouping, VocabularyItem, VocabularyItemGroup, VocabularyItemGroupWoId, VocabularyItemWithGroupId, VocabularyItemWoId } from "../lib/definitions";
import { sql } from "../lib/sql-util";

export type InsertOptions = {
  conflictResolutionAction: 'rolback' | 'abort' | 'fail' | 'ignore' | 'replace';
}

export class SqliteRepository implements DataRepository {
  private path: string;
  private conn: DatabaseType;

  constructor(path: string) {
    if (path == null || isStringBlank(path)) {
      throw new Error("Nullish or empty path to db");
    }

    this.path = path;
    this.conn = this.createDatabaseConnection();
  }

  public insertIntoVocabulary(vocabularyItem: VocabularyItemWoId): Database.RunResult {
    return this.prepareInsertIntoVocabularyStmt().run(vocabularyItem);
  }

  public insertAllIntoVocabulary(vocabularyItems: Array<VocabularyItemWoId>) {
    this.insertAllInSingleTransaction(this.prepareInsertIntoVocabularyStmt(), vocabularyItems);
  }

  public insertIntoGroups(group: VocabularyItemGroupWoId): Database.RunResult {
    return this.prepareInsertIntoGroupsStmt().run(group);
  }

  public insertAllIntoGroups(groups: Array<VocabularyItemGroupWoId>) {
    this.insertAllInSingleTransaction(this.prepareInsertIntoGroupsStmt(), groups);
  }

  public insertIntoVocabularyGrouping(grouping: VocabularyGrouping): Database.RunResult {
    return this.prepareInsertIntoVocabularyGroupingStmt().run(grouping);
  }

  public insertAllIntoVocabularyGrouping(groupings: Array<VocabularyGrouping>): void {
    this.insertAllInSingleTransaction(this.prepareInsertIntoVocabularyGroupingStmt(), groupings);
  }

  public insertVocabularyItemsWithGroupId(items: VocabularyItemWoId[], groupId: VocabularyItemGroup['id']): void {
    const vocabularyInsertStmt = this.prepareInsertIntoVocabularyStmt();
    const groupingInsertStmt = this.prepareInsertIntoVocabularyGroupingByItemTextStmt();

    const transaction = this.conn.transaction((items: VocabularyItemWoId[], groupId: VocabularyItemGroup['id']) => {
      items.forEach((item) => {
        vocabularyInsertStmt.run(item);
        groupingInsertStmt.run({ groupId, text: item.text });
      });
    });

    transaction(items, groupId);
  }

  public updateVocabularyByIdWithTextAndTranslation(
    params: Pick<VocabularyItem, "id" | "text" | "translation">,
  ): Database.RunResult {
    return this.prepareUpdateVocabularyByIdWithTextAndTranslationStmt().run(params);
  }

  public findGroupByName(name: string): VocabularyItemGroup | undefined {
    return this.prepareFindGroupByNameStmt().get({ name });
  }

  public findAllVocabularyItems(): Array<VocabularyItem> {
    return this.prepareFindAllVocabularyItemsStmt().all();
  }

  public findAllVocabularyItemsOrderByLimit(
    column: keyof TableVocabularyAttributes,
    limit: number,
  ): Array<VocabularyItem> {
    return this.prepareFindAllVocabularyItemsOrderByLimitStmt().all({ column, limit });
  }

  public findAllVocabItemsGroupIdEquals(groupId: number): Array<VocabularyItem> {
    return this.prepareFindAllVocabItemsGroupIdEqualsStmt().all({ groupId });
  }

  public findAllVocabItemsGroupIdEqualsOrderByLimit(
    groupId: number,
    column: keyof TableVocabularyAttributes,
    limit: number,
  ): Array<VocabularyItem> {
    return this.prepareFindAllVocabItemsGroupIdEqualsOrderByLimitStmt().all({
      groupId,
      column,
      limit,
    });
  }

  public findAllVocabItemsWithExtraGroupId(): Array<VocabularyItemWithGroupId> {
    return this.prepareFindAllVocabItemsWithExtraGroupIdStmt().all();
  }

  public findAllGroups(): VocabularyItemGroup[] {
    return this.prepareFindAllGroupsStmt().all();
  }

  public findAllVocabularyGroupings(): VocabularyGrouping[] {
    return this.prepareFindAllVocabularyGroupingsStmt().all();
  }

  private prepareInsertIntoVocabularyStmt(): StatementType<[VocabularyItemWoId]> {
    return this.conn.prepare<VocabularyItemWoId>(this.insertIntoVocabularyStmt());
  }

  private prepareInsertIntoGroupsStmt(): StatementType<[VocabularyItemGroupWoId]> {
    return this.conn.prepare<VocabularyItemGroupWoId>(this.insertIntoGroupsStmt());
  }

  private prepareInsertIntoVocabularyGroupingStmt(): StatementType<[VocabularyGrouping]> {
    return this.conn.prepare<VocabularyGrouping>(this.insertIntoVocabularyGroupingStmt());
  }

  private prepareInsertIntoVocabularyGroupingByItemTextStmt(): StatementType<[{ groupId: VocabularyItemGroup['id'], text: VocabularyItem['text'] }]> {
    return this.conn.prepare<{ groupId: VocabularyItemGroup['id'], text: VocabularyItem['text'] }>(this.insertIntoVocabularyGroupingByItemTextStmt());
  }

  private prepareUpdateVocabularyByIdWithTextAndTranslationStmt(): StatementType<
    [Pick<VocabularyItem, "id" | "text" | "translation">]
  > {
    return this.conn.prepare<Pick<VocabularyItem, "id" | "text" | "translation">>(
      this.updateVocabularyByIdWithTextAndTranslationStmt(),
    );
  }

  private prepareFindGroupByNameStmt(): StatementType<
    [Pick<VocabularyItemGroup, "name">],
    VocabularyItemGroup | undefined
  > {
    return this.conn.prepare<Pick<VocabularyItemGroup, "name">, VocabularyItemGroup | undefined>(
      this.findGroupByNameStmt(),
    );
  }

  private prepareFindAllVocabularyItemsStmt(): StatementType<unknown[], VocabularyItem> {
    return this.conn.prepare<never, VocabularyItem | undefined>(this.findAllVocabularyItemsStmt());
  }

  private prepareFindAllVocabularyItemsOrderByLimitStmt(): StatementType<
    [{ column: keyof TableVocabularyAttributes; limit: number }],
    VocabularyItem
  > {
    return this.conn.prepare<
      { column: keyof TableVocabularyAttributes; limit: number },
      VocabularyItem
    >(this.findAllVocabularyItemsOrderByLimitStmt());
  }

  private prepareFindAllVocabItemsGroupIdEqualsStmt(): StatementType<
    [{ groupId: TableVocabularyGroupingAttributes["group_id"] }],
    VocabularyItem
  > {
    return this.conn.prepare<
      [{ groupId: TableVocabularyGroupingAttributes["group_id"] }],
      VocabularyItem
    >(this.findAllVocabItemsGroupIdEqualsStmt());
  }

  private prepareFindAllVocabItemsGroupIdEqualsOrderByLimitStmt(): StatementType<
    [
      {
        groupId: TableVocabularyGroupingAttributes["group_id"];
        column: keyof TableVocabularyAttributes;
        limit: number;
      },
    ],
    VocabularyItem
  > {
    return this.conn.prepare<
      [
        {
          groupId: TableVocabularyGroupingAttributes["group_id"];
          column: keyof TableVocabularyAttributes;
          limit: number;
        },
      ],
      VocabularyItem
    >(this.findAllVocabItemsGroupIdEqualsOrderByLimitStmt());
  }

  private prepareFindAllVocabItemsWithExtraGroupIdStmt(): StatementType<
    unknown[],
    VocabularyItemWithGroupId
  > {
    return this.conn.prepare<never, VocabularyItemWithGroupId>(
      this.findAllVocabItemsWithExtraGroupIdStmt(),
    );
  }

  private prepareFindAllGroupsStmt(): StatementType<unknown[], VocabularyItemGroup> {
    return this.conn.prepare<never, VocabularyItem | undefined>(this.findAllGroupsStmt());
  }

  private prepareFindAllVocabularyGroupingsStmt(): StatementType<unknown[], VocabularyGrouping> {
    return this.conn.prepare<never, VocabularyGrouping>(this.findAllVocabularyGroupingsStmt());
  }

  private insertIntoVocabularyStmt(): string {
    return sql`
      INSERT INTO vocabulary (text, translation, created_date, last_updated_date)
      VALUES ($text, $translation, $createdDate, $lastUpdatedDate);`;
  }

  private insertIntoGroupsStmt(): string {
    return "INSERT INTO groups (name, description, created_date) VALUES ($name, $description, $createdDate);";
  }

  private insertIntoVocabularyGroupingStmt(): string {
    return "INSERT INTO vocabulary_grouping (item_id, group_id) VALUES ($itemId, $groupId);";
  }

  private insertIntoVocabularyGroupingByItemTextStmt(): string {
    return sql`
      INSERT INTO vocabulary_grouping (item_id, group_id)
      SELECT v.id, $groupId
      FROM vocabulary as v
      WHERE v.text = $text;`
  }

  private updateVocabularyByIdWithTextAndTranslationStmt(): string {
    return `
      UPDATE vocabulary
      SET text = $text, translation = $translation
      WHERE id = $id;
    `;
  }

  private findGroupByNameStmt(): string {
    return `SELECT id, name, description, created_date as createdDate FROM groups WHERE name = $name;`;
  }

  private findAllVocabularyItemsStmt(): string {
    return "SELECT id, text, translation, created_date as createdDate, last_updated_date as lastUpdatedDate FROM vocabulary;";
  }

  private findAllVocabularyItemsOrderByLimitStmt(): string {
    return "SELECT id, text, translation, created_date as createdDate, last_updated_date as lastUpdatedDate FROM vocabulary ORDER BY $column DESC LIMIT $limit";
  }

  private findAllVocabItemsGroupIdEqualsStmt(): string {
    return `
      SELECT v.id, v.text, v.translation, v.created_date as createdDate, v.last_updated_date as lastUpdatedDate
      FROM vocabulary as v
      JOIN vocabulary_grouping as vg
      ON v.id = vg.item_id
      WHERE vg.group_id = $groupId AND vg.item_id = v.id;
    `;
  }

  private findAllVocabItemsWithExtraGroupIdStmt(): string {
    return `
      SELECT v.id, v.text, v.translation, v.created_date as createdDate, v.last_updated_date as lastUpdatedDate, vg.group_id as groupId
      FROM vocabulary as v
      JOIN vocabulary_grouping as vg
      ON v.id = vg.item_id;
    `;
  }

  private findAllVocabItemsGroupIdEqualsOrderByLimitStmt(): string {
    return `
      SELECT v.id, v.text, v.translation, v.created_date as createdDate, v.last_updated_date as lastUpdatedDate
      FROM vocabulary as v
      JOIN vocabulary_grouping as vg
      ON v.id = vg.item_id
      WHERE vg.group_id = $groupId AND vg.item_id = v.id
      ORDER BY $column DESC
      LIMIT $limit;
    `;
  }

  private findAllGroupsStmt(): string {
    return "SELECT id, name, description, created_date as createdDate FROM groups;";
  }

  private findAllVocabularyGroupingsStmt(): string {
    return "SELECT item_id as itemId, group_id as groupId FROM vocabulary_grouping;";
  }

  private createDatabaseConnection(): DatabaseType {
    return new Database(this.path);
  }

  private insertAllInSingleTransaction<RowT>(
    statement: StatementType<[RowT], unknown>,
    rows: RowT[],
  ) {
    this.conn.transaction((items: typeof rows) => {
      items.forEach((item) => statement.run(item));
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
        item_id INTEGER NOT NULL,
        group_id INTEGER NOT NULL,
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

