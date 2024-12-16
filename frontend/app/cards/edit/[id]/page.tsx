'use client';

import EditPageContent from "./content";
import { useParams } from "next/navigation";

type RouteParams = {
  id: string;
}

export default function EditPage() {
  const params = useParams<RouteParams>();

  console.log(JSON.stringify(params));

  const itemId = params.id;

  if (!itemId) {
    throw new Error(`Missing search param "itemId". Received: ${JSON.stringify(itemId)}`);
  }

  const numberItemId = parseInt(itemId, 10);

  return (
    <EditPageContent itemId={numberItemId} />
  );
}
