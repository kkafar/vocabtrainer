import ButtonPanel from "@/app/ui/ButtonPanel";
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";
import MainTitle from "@/app/ui/MainTitle";
import FlexContainer from "./ui/layout/FlexContainer";
import RoundedButton, { ButtonProps } from "./ui/buttons/RoundedButton";
import styles from "./styles.module.css";
import { redirect } from "next/navigation";
import BookOpenIcon from "@/app/assets/book-open-icon.svg";
import PlayCircleIcon from "@/app/assets/play-circle-icon.svg";

function MenuButton({ children, ...rest }: ButtonProps) {
  return (
    <RoundedButton className={styles.menuItemButton} {...rest}>
      <div className={styles.menuItemButtonInnerContainer}>{children}</div>
    </RoundedButton>
  );
}

export default async function Home() {
  return (
    <FullScreenContainer>
      <CenterYXContainer>
        <FlexContainer flexDirection="column">
          <MainTitle />
          <div className={styles.separator}>
            <ButtonPanel direction="vertical">
              <MenuButton
                onClick={async () => {
                  "use server";
                  redirect("/cards/prepare");
                }}
              >
                Card game <PlayCircleIcon />
              </MenuButton>
              <MenuButton
                onClick={async () => {
                  "use server";
                  redirect("/vocabulary");
                }}
              >
                Vocabulary <BookOpenIcon />
              </MenuButton>
            </ButtonPanel>
          </div>
        </FlexContainer>
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
