import { fetchGroups } from "@/app/lib/data";

export async function GET() {
  // TODO: move data conversion here
  const groupList = await fetchGroups();
  return Response.json({ payload: groupList });
}
