import { VocabEntity } from "@/app/lib/definitions";

export async function fetchWordListQuery(): Promise<VocabEntity[]> {
  const endpoint = "http://localhost:3000/api/routes/wordlist";
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch wordlist from server");
    }

    const payload = await response.json();
    // return payload.payload;
    return await new Promise((resolve) => {
      resolve(new Promise((resolveInner) => {
        setTimeout(() => {
          resolveInner(payload.payload);
        }, 2000);
      }))
    })
  } catch (error) {
    throw new Error(`Failed to fetch wordlist from server with error: ${error}`)
  }
}
