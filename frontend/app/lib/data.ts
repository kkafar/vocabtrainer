import { getDataRepository } from "@/app/data/database";
import { VocabularyItem, VocabularyItemGroup } from "./definitions";

export async function fetchWordList(limit?: number, groupId?: VocabularyItemGroup['id']): Promise<VocabularyItem[]> {
  try {
    const repo = getDataRepository();

    if (groupId == null) {
      if (limit == null) {
        return repo.findAllVocabularyItems();
      } else {
        return repo.findAllVocabularyItemsOrderByLimit('text', limit);
      }
    } else {
      if (limit == null) {
        return repo.findAllVocabItemsGroupIdEquals(groupId);
      } else {
        return repo.findAllVocabItemsGroupIdEqualsOrderByLimit(groupId, 'text', limit);
      }
    }
  } catch (error) {
    console.log("Error while fetching word list", error);
    throw Error("Error while fetchin word list");
  }
}

export async function fetchGroups(): Promise<VocabularyItemGroup[]> {
  try {
    return getDataRepository().findAllGroups();
  } catch (error) {
    console.log("Error while fetching groups", error);
    throw Error("Error while fetchin groups", { cause: error });
  }
}
