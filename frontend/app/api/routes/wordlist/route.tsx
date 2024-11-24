import { fetchWordList } from "@/app/lib/data";

export async function GET() {
  const wordlist = await fetchWordList();
  return Response.json({ payload: wordlist });
}

