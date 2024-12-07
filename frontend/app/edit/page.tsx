'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditPageContent from "./content";
import { useSearchParams } from "next/navigation";

const queryClient = new QueryClient;

export default function EditPage() {
  const params = useSearchParams();

  const itemId = params.get("itemId");

  if (!itemId) {
    throw new Error(`Missing search param "itemId". Received: ${JSON.stringify(itemId)}`);
  }

  const numberItemId = parseInt(itemId, 10);

  return (
    <QueryClientProvider client={queryClient}>
      <EditPageContent itemId={numberItemId} />
    </QueryClientProvider>
  );
}
