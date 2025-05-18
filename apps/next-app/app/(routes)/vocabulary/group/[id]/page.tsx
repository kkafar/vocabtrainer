import { fetchWordList } from "@/app/lib/data";
import { VocabularyItem } from "@/app/lib/definitions";
import IconButton from "@/app/ui/buttons/IconButton";
import FitContentCard from "@/app/ui/card/FitContentCard";
import SpacerY from "@/app/ui/layout/Spacer";
import PlusIcon from '@/app/assets/plus-icon.svg';
import Link from "next/link";

function EmptyList() {
  return (
    <div className="flex flex-1 justify-center">
      Whoops... Looks like there are no items added to this group yet. Add some now!
    </div>
  )
}

function VocabularyItemsTableRow({ item }: { item: VocabularyItem }) {
  const translation = item.translation ?? '-';
  const date = new Date(item.createdDate)
  return (
    <tr className="hover:bg-on-primary">
      <td>{item.text}</td>
      <td>{translation}</td>
      <td>{date.toLocaleString()}</td>
    </tr>
  );
}

function VocablaryItemsTableHeadRow() {
  return (
    <thead>
      <tr>
        <th scope="col">Text</th>
        <th scope="col">Translation</th>
        <th scope="col">Created date</th>
      </tr>
    </thead>
  );
}

function VocabularyItemsTableInner({ items }: { items: VocabularyItem[] }) {
  return (
    <table>
      <VocablaryItemsTableHeadRow />
      <tbody>
        {items.map(item => <VocabularyItemsTableRow key={item.id.toString()} item={item} />)}
      </tbody>
    </table>
  );
}

function VocabularyItemsTable({ items }: { items: VocabularyItem[] }) {
  return (
    <FitContentCard>
      <div className="flex max-h-[80vh] overflow-y-scroll">
        <VocabularyItemsTableInner items={items} />
      </div>
    </FitContentCard>
  );
}

function AddItemsLink({ groupId }: { groupId?: number }) {
  const targetPath = groupId != null ? `/vocabulary/add/item?groupId=${encodeURIComponent(groupId)}` : '/vocabulary/add/item';

  return (
    <div>
      <Link href={targetPath}>
        <IconButton Icon={PlusIcon} className="bg-primary" />
      </Link>
    </div>
  );
}

export default async function VocabularyGroupPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const vocabularyItems = await fetchWordList(undefined, id);

  return (
    <div className="flex flex-1 flex-col items-center py-xlarge">
      {vocabularyItems.length === 0 && <EmptyList />}
      {vocabularyItems.length > 0 && <VocabularyItemsTable items={vocabularyItems} />}
      <SpacerY className="h-large" />
      <AddItemsLink groupId={id} />
    </div>
  );
}
