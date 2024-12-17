'use client';

import globalStyles from "@/app/styles.module.css";
import styles from './styles.module.css';
import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import VocabItemCard from "@/app/ui/card/VocabItemCard";
import { Suspense } from "react";

function LoadingCard() {
  return (
    <div>
      Card is loading!
    </div>
  );
}

export default function CardPage() {
  return (
      <CenterYXContainer>
        <div className={styles.columnFlexContainer}>
          <div className={globalStyles.cardContainer}>
            <Suspense fallback={<LoadingCard />}>
              <VocabItemCard />
            </Suspense>
          </div>
        </div>
      </CenterYXContainer>
  );
}
