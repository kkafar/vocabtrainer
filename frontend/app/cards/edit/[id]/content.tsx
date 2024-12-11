'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchWordListQuery } from "@/app/query";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FlexibleCard from "@/app/ui/FlexibleCard";
import VocabEditForm from "@/app/ui/VocabEditForm";
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import styles from './styles.module.css';
import RewindIcon from "@/app/assets/rewind-icon.svg";
import SubmitButton from "@/app/ui/buttons/SubmitButton";
import { useRouter } from "next/navigation";

export type EditPageContentProps = {
  itemId: number;
}

export default function EditPageContent({ itemId }: EditPageContentProps) {
  const wordListQuery = useQuery({ queryKey: ['wordlist'], queryFn: fetchWordListQuery });
  const router = useRouter();

  if (wordListQuery.isPending) {
    return (
      <div>
        Edit page is pending...
      </div>
    );
  }

  if (wordListQuery.isError) {
    return (
      <div>
        Error while fetching data for edit page...
      </div>
    );
  }

  const entity = wordListQuery.data.find((value) => value.id === itemId);

  if (!entity) {
    throw new Error(`Failed to find entity with id of ${itemId}`);
  }

  return (
    <CenterYXContainer>
      <div className={styles.columnFlexContainer}>
        <FlexibleCard>
          <VocabEditForm formId="editForm" entity={entity}/>
        </FlexibleCard>
        <div className={styles.panelSpacer}>
          <ButtonPanel>
            <RoundedButton onClick={() => router.back()}>
              Cancel <RewindIcon />
            </RoundedButton>
            <SubmitButton form="editForm" />
          </ButtonPanel>
        </div>
      </div>
    </CenterYXContainer>
  );
}
