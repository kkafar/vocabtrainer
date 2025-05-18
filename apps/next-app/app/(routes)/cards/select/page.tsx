import { fetchGroups, fetchVocabularyGroupings, fetchWordList } from "@/app/lib/data"
import SelectVocabularyItemForm from "@/app/ui/form/SelectVocabularyItemForm";

export default async function SelectVocabularyPage() {
  const [vocabularyItems, vocabularyGroups, vocabularyGrouping] = await Promise.all([
    fetchWordList(),
    fetchGroups(),
    fetchVocabularyGroupings(),
  ]);

  return (
    <div>
      <SelectVocabularyItemForm id="selectItemsForm" items={vocabularyItems} groups={vocabularyGroups} grouping={vocabularyGrouping} />
    </div>
  );
}

