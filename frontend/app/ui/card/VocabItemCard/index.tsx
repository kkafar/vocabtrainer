import React from "react";
import { fetchWordListQuery } from "@/app/query";
import VocabItemCardSelector from "./VocabItemCardSelector";
import { VocabularyItemGroup } from "@/app/lib/definitions";

export type VocabItemCardProps = {
  groupId?: VocabularyItemGroup['id'];
};

export default async function VocabItemCard({ groupId }: VocabItemCardProps) {
  const wordlist = await fetchWordListQuery(groupId);

  return (
    <VocabItemCardSelector vocabularyItems={wordlist} />
  );
}
