'use client';

import globalStyles from "@/app/styles.module.css";
import styles from './styles.module.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CenterYXContainer from "../ui/layout/CenterYXContainer";
import VocabItemCard from "../ui/card/VocabItemCard";
import { Suspense } from "react";

const queryClient = new QueryClient();

function LoadingCard() {
  return (
    <div>
      Card is loading!
    </div>
  );
}

export default function CardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <CenterYXContainer>
        <div className={styles.columnFlexContainer}>
          <div className={globalStyles.cardContainer}>
            <Suspense fallback={<LoadingCard />}>
              <VocabItemCard />
            </Suspense>
          </div>
        </div>
      </CenterYXContainer>
    </QueryClientProvider>
  );
}
