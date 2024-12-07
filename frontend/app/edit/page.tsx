'use client';

import EditPageContent from "./content";
import { useSearchParams } from "next/navigation";

export default function EditPage() {
  const params = useSearchParams();

  const itemId = params.get("itemId");

  if (!itemId) {
    throw new Error(`Missing search param "itemId". Received: ${JSON.stringify(itemId)}`);
  }

  const numberItemId = parseInt(itemId, 10);

  return (
    <EditPageContent itemId={numberItemId} />
  );
}
