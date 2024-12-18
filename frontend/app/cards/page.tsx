import globalStyles from "@/app/styles.module.css";
import styles from './styles.module.css';
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import VocabItemCard from "@/app/ui/card/VocabItemCard";
import { Suspense } from "react";
import { OrbitProgress } from "react-loading-indicators";
import FullScreenContainer from "../ui/layout/FullScreenContainer";

function LoadingCard() {
  return (
    <OrbitProgress color="var(--primary)" size="large" text="Fetching data from server..." textColor="var(--on-primary)" />
  );
}

export default async function CardPage() {
  return (
    <FullScreenContainer>
      <CenterYXContainer>
        <div className={styles.columnFlexContainer}>
          <div className={globalStyles.cardContainer}>
            <Suspense fallback={<LoadingCard />}>
              <VocabItemCard />
            </Suspense>
          </div>
        </div>
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
