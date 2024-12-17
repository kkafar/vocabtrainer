import React from "react";
import { fetchWordListQuery } from "@/app/query";
import VocabItemCardSelector from "./VocabItemCardSelector";


export default async function VocabItemCard() {
  const wordlist = await fetchWordListQuery();

  return (
    <VocabItemCardSelector vocabularyItems={wordlist} />
  );
}
