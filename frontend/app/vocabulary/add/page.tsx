import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";
import AddGroupForm from "./AddGroupForm";
import styles from './styles.module.css';
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import RoundedIcon from '@/app/assets/rewind-icon.svg';
import { redirect } from "next/navigation";
import SubmitButton from "@/app/ui/buttons/SubmitButton";

export default async function AddPage() {
  const formId = "addGroupForm";

  return (
    <FullScreenContainer>
      <CenterYXContainer>
        <div className={styles.columnFlexContainer}>
          <AddGroupForm formId={formId} />
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
