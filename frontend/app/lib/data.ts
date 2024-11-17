import createDatabaseConnection from "@/app/data/database";
import { EmptyObject, VocabEntity } from "./definitions";

export async function fetchWordList(limit?: number): Promise<VocabEntity[]> {
  try {
    const conn = createDatabaseConnection();

    const query = conn.prepare<EmptyObject, VocabEntity>(limit == null ? `
      SELECT * FROM vocabulary;
    ` : `
      SELECT * FROM vocabulary ORDER BY text DESC LIMIT ${limit};
    `);

    const queryResult = query.all({});
    return queryResult;
  } catch (error) {
    console.log("Error while fetching word list", error);
    throw Error("Error while fetchin word list");
  }
}
