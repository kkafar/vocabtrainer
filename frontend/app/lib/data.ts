import createDatabaseConnection from "@/app/data/database";
import { EmptyObject, TableGroupAttributes, TableVocabularyAttributes, VocabularyItem, VocabularyItemGroup } from "./definitions";

export async function fetchWordList(limit?: number, groupId?: VocabularyItemGroup['id']): Promise<VocabularyItem[]> {
  try {
    const conn = createDatabaseConnection();

    let query;

    if (groupId == null) {
      query = conn.prepare<EmptyObject, TableVocabularyAttributes>(limit == null ? `
        SELECT * FROM vocabulary;
      ` : `
        SELECT * FROM vocabulary ORDER BY text DESC LIMIT ${limit};
      `);
    } else {
      query = conn.prepare<EmptyObject, TableVocabularyAttributes>(limit == null ? `
        SELECT v.* FROM vocabulary as v JOIN vocabulary_grouping as vg ON item_id WHERE vg.group_id = ${groupId} AND vg.item_id = v.id;
      ` : `
        SELECT v.* FROM vocabulary as v JOIN vocabulary_grouping as vg ON item_id WHERE vg.group_id = ${groupId} AND vg.item_id = v.id ORDER BY v.text DESC LIMIT ${limit};
      `);
    }

    const queryResult = query.all({});
    return queryResult.map(row => {
      return {
        id: row.id,
        text: row.text,
        translation: row.translation,
        createdDate: row.created_date,
        lastUpdatedDate: row.last_updated_date
      };
    });
  } catch (error) {
    console.log("Error while fetching word list", error);
    throw Error("Error while fetchin word list");
  }
}

export async function fetchGroups(): Promise<VocabularyItemGroup[]> {
  try {
    const conn = createDatabaseConnection();

    const query = conn.prepare<EmptyObject, TableGroupAttributes>(`
      SELECT * FROM groups;
    `);

    const queryResult = query.all({});
    return queryResult.map(row => {
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        createdDate: row.created_date,
      };
    });
  } catch (error) {
    console.log("Error while fetching groups", error);
    throw Error("Error while fetchin groups", { cause: error });
  }
}

