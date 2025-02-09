'use client';

import React from "react";
import { fetchWordListQuery } from "@/app/query";
import VocabItemCardSelector from "./VocabItemCardSelector";
import { VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";
import { SelectedItemsSchema } from "@/app/lib/schemas";

export type VocabItemCardProps = {
  groupId?: VocabularyItemGroup['id'];
};

export default function VocabItemCard({ groupId }: VocabItemCardProps) {
  const [wordlist, setWordlist] = React.useState<VocabularyItem[]>([]);
  const [isFetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    // First try to get data from local storage.
    const maybeSelectedItemsRaw = window.sessionStorage.getItem('selectedItems');

    if (maybeSelectedItemsRaw) {
      const selectedItemsRawObject = JSON.parse(maybeSelectedItemsRaw);
      console.log(selectedItemsRawObject);
      const selectedItems = SelectedItemsSchema.parse(selectedItemsRawObject);
      setFetching(false);
      setWordlist(selectedItems);
      return;
    }

    // Otherwise try to fetch from backend.
    // TODO: handle errors here
    fetchWordListQuery(groupId).then((items) => {
      setFetching(false);
      setWordlist(items)
    });
  }, [groupId]);

  if (isFetching) {
    return (
      <div>
        Fetching data...
      </div>
    );
  }

  return (
    <VocabItemCardSelector vocabularyItems={wordlist} />
  );
}
