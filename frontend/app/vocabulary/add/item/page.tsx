import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";
import styles from './styles.module.css';
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import { redirect } from "next/navigation";
import AddItemForm from "./AddItemForm";
import RoundedIcon from '@/app/assets/rewind-icon.svg';
import SubmitButton from "@/app/ui/buttons/SubmitButton";

export default async function AddItemPage() {
  const formId = "addItemForm";

  return (
    <FullScreenContainer>
      <CenterYXContainer>
        <div className={styles.columnFlexContainer}>
          <AddItemForm formId={formId} />
          <div className={styles.panelSpacer}>
            <ButtonPanel>
              <RoundedButton onClick={async () => {
                'use server';
                redirect('/vocabulary');
              }}>
                Cancel <RoundedIcon />
              </RoundedButton>
              <SubmitButton form={formId} />
            </ButtonPanel>
          </div>
        </div>
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
