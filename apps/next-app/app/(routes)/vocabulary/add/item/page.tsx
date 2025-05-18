import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import styles from "./styles.module.css";
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton from "@/app/ui/buttons/RoundedButton";
import { redirect } from "next/navigation";
import AddItemForm from "./AddItemForm";
import RoundedIcon from "@/app/assets/rewind-icon.svg";
import SubmitButton from "@/app/ui/buttons/SubmitButton";

export default async function AddItemPage({ searchParams }: { searchParams: Promise<{ groupId?: number }> }) {
  const { groupId } = await searchParams;
  const formId = "addItemForm";

  return (
    <CenterYXContainer>
      <div className={styles.columnFlexContainer}>
        <AddItemForm formId={formId} groupId={groupId} />
        <div className={styles.panelSpacer}>
          <ButtonPanel>
            <RoundedButton
              onClick={async () => {
                "use server";
                redirect("/vocabulary");
              }}
            >
              Cancel <RoundedIcon />
            </RoundedButton>
            <SubmitButton form={formId} />
          </ButtonPanel>
        </div>
      </div>
    </CenterYXContainer>
  );
}
