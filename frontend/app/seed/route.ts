import { type Database as DatabaseType } from 'better-sqlite3';
import { lessonOne, testItemGroup } from '../data/initdata';
import createDatabaseConnection, { getDataRepository } from '../data/database';
import featureFlags from '@/app/featureflags';
import { z } from 'zod';
import { TableGroupAttributesSchema, TableVocabularyAttributesSchema } from '../lib/schemas';
import { TableGroupAttributes } from '../lib/definitions';
import { adaptKeysToCamelCase } from '../lib/object-util';

const VocabularyItemSeedSchema = TableVocabularyAttributesSchema.omit({ id: true });
const VocabularyGroupSeedSchema = TableGroupAttributesSchema.omit({ id: true });

const VocabularySeedSchema = z.object({
  entities: z.array(VocabularyItemSeedSchema),
  group: VocabularyGroupSeedSchema,
});

type VocabularyItemSeed = z.infer<typeof VocabularyItemSeedSchema>;
type VocabularyGroupSeed = z.infer<typeof VocabularyGroupSeedSchema>;
type VocabularySeed = z.infer<typeof VocabularySeedSchema>;

async function seedVocabulary(db: DatabaseType, data: VocabularySeed) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL UNIQUE CHECK (length(text) > 0),
      translation TEXT,
      created_date TEXT NOT NULL,
      last_updated_date TEXT NOT NULL
    );
  `);

  console.log(`Creating "vocabulary" table...`);
  const result = createTableStmt.run();
  console.log(`Creating "vocabulary" table completed with result ${JSON.stringify(result)}`);

  type BindParams = {
    text: VocabularyItemSeed['text'],
    translation: VocabularyItemSeed['translation'],
    createdDate: VocabularyItemSeed['created_date'],
    lastUpdatedDate: VocabularyItemSeed['last_updated_date'],
  };

  const insertStmt = db.prepare<BindParams>(`
    INSERT INTO vocabulary (text, translation, created_date, last_updated_date) VALUES ($text, $translation, $createdDate, $lastUpdatedDate);
  `);

  db.transaction((entities: VocabularySeed['entities']) => {
    entities.forEach(entity => {
      insertStmt.run({
        text: entity.text,
        translation: entity.translation,
        createdDate: entity.created_date,
        lastUpdatedDate: entity.last_updated_date,
      });
    });
  })(data.entities);
}

async function seedGroup(db: DatabaseType, groupData: VocabularyGroupSeed[]) {
  const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE CHECK (length(name) > 0),
      description TEXT,
      created_date TEXT NOT NULL
    );
  `);

  console.log(`Creating "groups" table...`);
  const result = createTableStmt.run();
  console.log(`Creating "groups" table completed with result ${JSON.stringify(result)}`);

  type BindParams = {
    name: VocabularyGroupSeed['name'];
    description: VocabularyGroupSeed['description'];
    createdDate: VocabularyGroupSeed['created_date'];
  };

  const insertStmt = db.prepare<BindParams>(`
    INSERT INTO groups (name, description, created_date) VALUES ($name, $description, $createdDate);
  `);

  const transaction = db.transaction((groupData: VocabularyGroupSeed[]) => {
    groupData.forEach(group => {
      insertStmt.run({
        name: group.name,
        description: group.description,
        createdDate: group.created_date,
      });
    });
  });

  transaction(groupData);
}

async function seedVocabularyGrouping(db: DatabaseType, data: VocabularySeed) {
  const createTableStmt = db.prepare(`
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

  // // First we need to have the group id
  const groupQuery = db.prepare(`SELECT id FROM groups WHERE name = ?`);
  const groupQueryResult = groupQuery.get([data.group.name]) as Pick<TableGroupAttributes, 'id'> | undefined;

  if (groupQueryResult === undefined) {
    throw Error(`Seems that no group with name ${data.group.name} is currently in database`);
  }

  const groupId = groupQueryResult.id;

  console.debug('Retrieved group id of ', groupId);

  const insertStmt = db.prepare(`
    INSERT INTO vocabulary_grouping SELECT DISTINCT id, $groupId FROM vocabulary;
  `);

  insertStmt.run({ groupId: groupId });
  // TODO: handle errors
}

export async function oldImpl() {
  if (featureFlags.usesNewDatabaseSchema) {
    try {
      // Parse data
      const parsedVocabularySeedDataLessonOne = VocabularySeedSchema.parse(lessonOne);
      const parsedVocabularySeedDataTestData = VocabularySeedSchema.parse(testItemGroup);

      const db = createDatabaseConnection();
      await seedVocabulary(db, parsedVocabularySeedDataLessonOne);
      await seedGroup(db, [parsedVocabularySeedDataLessonOne.group, parsedVocabularySeedDataTestData.group]);
      await seedVocabularyGrouping(db, parsedVocabularySeedDataLessonOne);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json({ message: "Success" })
  } else {
    return Response.json({ message: "Success" })
  }
}


export async function GET() {
  try {
    const parsedVocabularySeedDataLessonOne: VocabularySeed = VocabularySeedSchema.parse(lessonOne);
    const parsedVocabularySeedDataTestData: VocabularySeed = VocabularySeedSchema.parse(testItemGroup);

    const repo = getDataRepository();

    const adaptedLessonOneEntities = parsedVocabularySeedDataLessonOne.entities.map(entity => adaptKeysToCamelCase(entity));
    const adaptedTestVocabularyItems = parsedVocabularySeedDataTestData.entities.map(entity => adaptKeysToCamelCase(entity));

    repo.createSchema();
    repo.insertAllIntoVocabulary(adaptedLessonOneEntities);
    repo.insertAllIntoVocabulary(adaptedTestVocabularyItems);
    repo.insertAllIntoGroups([parsedVocabularySeedDataLessonOne.group, parsedVocabularySeedDataTestData.group].map(group => adaptKeysToCamelCase(group)));

  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
