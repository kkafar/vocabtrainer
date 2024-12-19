import { fetchWordListQuery } from "@/app/query";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FlexibleCard from "@/app/ui/FlexibleCard";
import VocabEditForm from "@/app/ui/VocabEditForm";
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import styles from './styles.module.css';
import RewindIcon from "@/app/assets/rewind-icon.svg";
import SubmitButton from "@/app/ui/buttons/SubmitButton";
import { redirect } from "next/navigation";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";

export type EditPageContentProps = {
  itemId: number;
}

export default async function EditPageContent({ itemId }: EditPageContentProps) {
  const vocabularyItems = await fetchWordListQuery();

  const entity = vocabularyItems.find((value) => value.id === itemId);

  if (!entity) {
    throw new Error(`Failed to find entity with id of ${itemId}`);
  }

  return (
    <FullScreenContainer>
      <CenterYXContainer>
        <div className={styles.columnFlexContainer}>
          <FlexibleCard>
            <VocabEditForm formId="editForm" entity={entity}/>
          </FlexibleCard>
          <div className={styles.panelSpacer}>
            <ButtonPanel>
              <RoundedButton onClick={async () => {
                'use server';
                redirect('/cards');
              }}>
                Cancel <RewindIcon />
              </RoundedButton>
              <SubmitButton form="editForm" />
            </ButtonPanel>
          </div>
        </div>
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
