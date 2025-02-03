import { fetchWordList } from "@/app/lib/data";
import { VocabularyItem } from "@/app/lib/definitions";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";

function VocabularyItemsList({ items }: { items: VocabularyItem[] }) {
  return (
    <div>
      <ul>
        {items.map((item) => <li key={item.id}>{item.text} -  {item.translation}</li>)}
      </ul>
    </div>
  );
}

export default async function VocabularyGroupPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const vocabularyItems = await fetchWordList(undefined, id);

  return (
    <FullScreenContainer>
      <CenterYXContainer>
        {vocabularyItems.length > 0 && <VocabularyItemsList items={vocabularyItems} />}
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
