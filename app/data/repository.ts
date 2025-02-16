import Database from "better-sqlite3";
import { TableVocabularyAttributes, VocabularyGrouping, VocabularyItem, VocabularyItemGroup, VocabularyItemGroupWoId, VocabularyItemWithGroupId, VocabularyItemWoId } from "../lib/definitions";

/**
 * Overall shape of the queries the data source should support
 */
export interface DataRepository {
  insertIntoVocabulary(item: VocabularyItemWoId): Database.RunResult;
  insertAllIntoVocabulary(items: VocabularyItemWoId[]): void;

  insertIntoGroups(group: VocabularyItemGroupWoId): Database.RunResult;
  insertAllIntoGroups(groups: VocabularyItemGroupWoId[]): void;

  insertIntoVocabularyGrouping(grouping: VocabularyGrouping): Database.RunResult;
  insertAllIntoVocabularyGrouping(groupings: VocabularyGrouping[]): void;

  // TODO: This MUST also take lastUpdatedDate. I'm not sure whether whether the DataRepository should guard
  // this field semantics and update this field whenever update is made or require user to pass the value.
  updateVocabularyByIdWithTextAndTranslation(
    params: Pick<VocabularyItem, "id" | "text" | "translation">,
  ): Database.RunResult;

  findAllVocabularyItems(): VocabularyItem[];
  findAllVocabularyItemsOrderByLimit(
    column: keyof TableVocabularyAttributes,
    limit: number,
  ): VocabularyItem[];
  findAllVocabItemsGroupIdEquals(groupId: number): VocabularyItem[];
  findAllVocabItemsGroupIdEqualsOrderByLimit(
    groupId: number,
    column: keyof TableVocabularyAttributes,
    limit: number,
  ): VocabularyItem[];
  findAllVocabItemsWithExtraGroupId(): VocabularyItemWithGroupId[];

  findGroupByName(name: string): VocabularyItemGroup | undefined;
  findAllGroups(): VocabularyItemGroup[];

  findAllVocabularyGroupings(): VocabularyGrouping[];

  // These should be moved from this interface later (so that these methods are not public)
  createSchema(): void;
}

