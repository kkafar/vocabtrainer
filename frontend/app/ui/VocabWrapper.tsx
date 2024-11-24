'use client';

import VocabCard from "./VocabCard";
import { useQuery } from "@tanstack/react-query";
import { fetchWordListQuery } from "@/app/query";
import styles from './styles.module.css';
import { useState } from "react";

export default function VocabWrapper() {
  const wordlistQuery = useQuery({ queryKey: ['wordlist'], queryFn: fetchWordListQuery });
  const [currentVocabItem, setCurrentVocabItem] = useState<number>(0);

  if (wordlistQuery.isPending) {
    return (
      <div>
        Data request is pending...
      </div>
    );
  }

  if (wordlistQuery.isError) {
    return (
      <div>
        Data request failed with error {JSON.stringify(wordlistQuery.error)}
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardPositioner}>
        <VocabCard entity={wordlistQuery.data[currentVocabItem]} />
      </div>
    </div>
  );
}
