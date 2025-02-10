import { fetchGroups, fetchVocabularyGroupings, fetchWordList } from "@/app/lib/data";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer"
import SelectedItemsList from "./SelectedItemsList";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import Link from "next/link";

export default async function SelectVocabularyPage() {
  const vocabularyItems = await fetchWordList();
  const vocabularyItemGroups = await fetchGroups();
  const vocabularyItemGroupings = await fetchVocabularyGroupings();

  return (
    <CenterYXContainer>
      <div className="flex flex-col items-center gap-8">
        <SelectedItemsList items={vocabularyItems} groups={vocabularyItemGroups} groupings={vocabularyItemGroupings} />
        <Link href="/cards">
          <RoundedButton>
            Proceed
          </RoundedButton>
        </Link>
      </div>
    </CenterYXContainer>
  );
}
