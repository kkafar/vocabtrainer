import { type Database as DatabaseType } from 'better-sqlite3';
import { lessonOne } from '../data/initdata';
import createDatabaseConnection from '../data/database';
import featureFlags from '@/app/featureflags';

async function seedVocabulary(db: DatabaseType) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL CHECK (length(text) > 0),
      translation TEXT,
      created_date: TEXT NOT NULL,
      last_updated_date: TEXT NOT NULL
    );
  `);

  const result = createTableStmt.run();
  // TODO: Handle errors here

  // TODO: Populate with vocabulary
}

async function seedGroup(db: DatabaseType) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS group (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE CHECK (length(name) > 0),
      description TEXT,
      created_date: TEXT NOT NULL
    );
  `);

  createTableStmt.run();
  // TODO: Handle errors here
  // TODO: Populate group based on lessons
}

async function seedVocabularyGrouping(db: DatabaseType) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS vocabulary_grouping (
      item_id INTEGER,
      group_id INTEGER,
      PRIMARY KEY (item_id, group_id),
      FOREIGN KEY (item_id) REFERENCES vocabulary (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES group (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
  `);

  createTableStmt.run();
  // TODO: Handle errors here
  // TODO: Populate groupings based on lessons
}

async function seedVocabularyStats(db: DatabaseType) {
  const createTableStmt = db.prepare(`
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
  // TODO: Handle errors here
  // TODO: Populate groupings with default values or some randomized ones so that it looks better
}

async function seedGameSession(db: DatabaseType) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS game_session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT NOT NULL,
      expiration_date TEXT,
      description TEXT
    );
  `);

  createTableStmt.run();
  // TODO: Handle errors here
}

async function seedGameSessionItems(db: DatabaseType) {
  const createTableStmt = db.prepare(`
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
  // TODO: Handle errors here
}

async function seedGameSessionCurrentItem(db: DatabaseType) {
  const createTableStmt = db.prepare(`
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
  // TODO: Handle errors here
}

async function seedLessons(db: DatabaseType) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS lesson (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_date TEXT,
      submission_date TEXT NOT NULL,
      description TEXT NOT NULL
    );`
  );

  createTableStmt.run();

  const { lesson_date } = lessonOne.metadata;
  let { submission_date = "", description = "" } = lessonOne.metadata;

  if (submission_date == null) {
    submission_date = "";
  }

  if (description == null) {
    description = "";
  }

  const insertStmt = db.prepare(`
    INSERT INTO lesson (lesson_date, submission_date, description) VALUES (?, ?, ?);`
  );

  insertStmt.run(lesson_date, submission_date, description);
}

async function seedVocabEntities(db: DatabaseType) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      translation TEXT NOT NULL,
      FOREIGN KEY (lesson_id)
        REFERENCES lesson (id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
    );
  `);

  createTableStmt.run();

  const entities = lessonOne.entities.map((entity) => {
    return {
      text: entity.text,
      translation: entity.translation != null ? entity.translation : "",
    }
  });

  const insertStmt = db.prepare(`
    INSERT INTO vocabulary (lesson_id, text, translation) VALUES (?, ?, ?);
  `);

  db.transaction((entities: Array<{ text: string; translation: string; }>) => {
    entities.forEach(entity => {
      insertStmt.run(1, entity.text, entity.translation);
    });
  })(entities);
}

export async function GET() {
  if (featureFlags.usesNewDatabaseSchema) {
    try {
      const db = createDatabaseConnection();
      await seedVocabulary(db);
      await seedGroup(db);
      await seedVocabularyGrouping(db);
      await seedVocabularyStats(db);
      await seedGameSession(db);
      await seedGameSessionItems(db);
      await seedGameSessionCurrentItem(db);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json({ message: "Success" })
  } else {
    try {
      const db = createDatabaseConnection();
      await seedLessons(db);
      await seedVocabEntities(db);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json({ message: "Success" })
  }


}
