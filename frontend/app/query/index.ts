import { VocabularyItem } from "@/app/lib/definitions";

export async function fetchWordListQuery(): Promise<VocabularyItem[]> {
  const endpoint = "http://localhost:3000/api/routes/wordlist";
  try {
    const response = await fetch(endpoint, { cache: 'force-cache' });

    if (!response.ok) {
      throw new Error("Failed to fetch wordlist from server");
    }

    const payload = await response.json();
    return payload.payload;
  } catch (error) {
    throw new Error(`Failed to fetch wordlist from server with error: ${error}`)
  }
}

export async function fetchGroupsQuery(): Promise<void> {
  const endpoint = "http://localhost:3000/api/routes/groups";
  try {
    const response = await fetch(endpoint, { cache: 'force-cache' });

    if (!response.ok) {
      throw new Error("Failed to fetch group information from server");
    }

    const payload = await response.json();
    return payload.payload;
  } catch (error) {
    throw new Error(`Failed to fetch groups information from server with error: ${error}`, { cause: error });
  }
}
