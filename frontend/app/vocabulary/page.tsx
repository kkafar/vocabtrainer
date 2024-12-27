import { fetchGroupsQuery } from "@/app/query";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";
import { VocabularyItemGroup } from "../lib/definitions";
import GroupCard from "@/app/ui/GroupCard";
import styles from './styles.module.css';
import Link from "next/link";
import IconButton from "../ui/buttons/IconButton";
import { ChildrenProp } from "../ui/types";
import PlusIcon from '@/app/assets/plus-icon.svg';

function VocabularyGroupListItem({ group }: { group: VocabularyItemGroup }) {
  return (
    <Link href={`/cards?groupId=${group.id}`} >
      <GroupCard group={group} />
    </Link>
  );
}

function VocabularyGroupListImpl({ vocabularyGroups }: { vocabularyGroups: VocabularyItemGroup[] }) {
  return (
    <div className={styles.vocabList}>
      {vocabularyGroups.map((group) => (
        <VocabularyGroupListItem key={group.id} group={group} />
      ))}
    </div>
  );
}

async function VocabularyGroupList() {
  const vocabularyGroups = await fetchGroupsQuery();

  return (
    <VocabularyGroupListImpl vocabularyGroups={vocabularyGroups} />
  );
}

async function Toolbar({ children }: ChildrenProp) {
  return (
    <div className={styles.toolbar}>
      {children}
    </div>
  )
}

async function AddGroup() {
  return (
    <div>
      <Link href='/vocabulary/add'>
        <IconButton Icon={PlusIcon} />
      </Link>
    </div>
  );
}

export default async function VocabularyPage() {
  return (
    <FullScreenContainer>
      <Toolbar>
        <AddGroup />
      </Toolbar>
      <CenterYXContainer>
        <VocabularyGroupList />
      </CenterYXContainer>
    </FullScreenContainer>
  )
}
