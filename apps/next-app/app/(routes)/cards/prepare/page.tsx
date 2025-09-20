import {
  fetchGroups,
  fetchVocabularyGroupings,
  fetchWordList,
} from "@/app/lib/data";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import SelectedItemsList from "./SelectedItemsList";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import Link from "next/link";

export default async function SelectVocabularyPage() {
  const vocabularyItems = await fetchWordList();
  const vocabularyItemGroups = await fetchGroups();
  const vocabularyItemGroupings = await fetchVocabularyGroupings();

  return (
    <CenterYXContainer>
      <div className="flex flex-col items-center">
        <SelectedItemsList
          items={vocabularyItems}
          groups={vocabularyItemGroups}
          groupings={vocabularyItemGroupings}
        />
        <Link href="/cards">
          <div className="pt-4">
            <RoundedButton className="bg-success text-text-on-bg">
              Proceed
            </RoundedButton>
          </div>
        </Link>
      </div>
    </CenterYXContainer>
  );
}
