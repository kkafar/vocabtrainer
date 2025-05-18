import { VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";

export async function fetchWordListQuery(groupId?: VocabularyItemGroup['id']): Promise<VocabularyItem[]> {
  const endpoint = new URL("http://localhost:3000/api/wordlist");
  if (groupId != null) {
    endpoint.searchParams.append('groupId', groupId.toString());
  }

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

export async function fetchGroupsQuery(): Promise<VocabularyItemGroup[]> {
  const endpoint = "http://localhost:3000/api/groups";
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

