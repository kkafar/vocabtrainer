import { fetchWordList } from "@/app/lib/data";
import { VocabularyItemGroup } from "@/app/lib/definitions";
import { NextRequest } from "next/server";

function safeParseInt(maybeInt?: string | null): number | undefined {
  if (maybeInt == null) {
    return undefined;
  }

  let parsedNumber;
  try {
    parsedNumber = parseInt(maybeInt, 10);
  } catch {
    parsedNumber = undefined;
  }
  return parsedNumber;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit: number | undefined = safeParseInt(searchParams.get("limit"));
  const groupId: VocabularyItemGroup['id'] | undefined = safeParseInt(searchParams.get('groupId'));

  const wordlist = await fetchWordList(limit, groupId);
  return Response.json({ payload: wordlist });
}

