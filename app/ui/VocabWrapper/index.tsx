'use client';

import VocabCard from "./VocabCard";
import { useQuery } from "@tanstack/react-query";
import { fetchWordListQuery } from "@/app/query";
import { useState } from "react";

export default function VocabWrapper() {
  const wordlistQuery = useQuery({ queryKey: ['wordlist'], queryFn: fetchWordListQuery });

  const currentItemId = parseInt(window.sessionStorage.getItem('lastItemId') ?? '0', 10);
  const [currentVocabItemIndex, setCurrentVocabItemIndex] = useState<number>(currentItemId);

  console.log('currentVocabItemIndex', currentVocabItemIndex);

  const handleReturnClicked = () => {
    console.log('Return clicked');
    setCurrentVocabItemIndex(last => {
      if (!wordlistQuery.isSuccess) {
        return last;
      }
      const minIndex = 0;
      if (last - 1 < minIndex) {
        return minIndex;
      } else {
        return last - 1;
      }
    });
  };

  const handleProgressClicked = () => {
    console.log('Progress clicked');
    setCurrentVocabItemIndex(last => {
      if (!wordlistQuery.isSuccess) {
        return last;
      }
      const maxIndex = wordlistQuery.data.length - 1;
      if (last + 1 <= maxIndex) {
        return last + 1;
      } else {
        return maxIndex;
      }
    });
  }

  const handleRepeatClicked = () => {
    console.log('Repeat clicked');
  }

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
        <VocabCard entity={wordlistQuery.data[currentVocabItemIndex]} />
  );
}
