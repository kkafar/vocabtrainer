import { fetchGroups, fetchVocabularyGroupings, fetchWordList } from "@/app/lib/data";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer"
import SelectedItemsList from "./SelectedItemsList";

export default async function SelectVocabularyPage() {
  const vocabularyItems = await fetchWordList();
  const vocabularyItemGroups = await fetchGroups();
  const vocabularyItemGroupings = await fetchVocabularyGroupings();

  return (
    <CenterYXContainer>
      <div>
        <SelectedItemsList items={vocabularyItems} groups={vocabularyItemGroups} groupings={vocabularyItemGroupings} />
      </div>
    </CenterYXContainer>
  );
}
