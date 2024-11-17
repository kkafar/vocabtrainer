import Database from 'better-sqlite3';
import { type Database as DatabaseType } from 'better-sqlite3';
import { lessonOne } from '../data/initdata';

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
  const dbPath = process.env.SQLITE_DB_PATH;

  if (!dbPath) {
    return Response.json({ error: "Invalid environment setup" }, { status: 500 });
  }

  try {
    const db = new Database(dbPath);
    await seedLessons(db);
    await seedVocabEntities(db);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ message: "Success" })
}
