import EditPageContent from "./content";

type RouteParams = {
  id: string;
}

type PageParams = {
  params: Promise<RouteParams>;
}

export default async function EditPage({ params }: PageParams) {
  const { id } = await params;

  console.log(JSON.stringify(params));

  const itemId = id;

  if (!itemId) {
    throw new Error(`Missing search param "itemId". Received: ${JSON.stringify(itemId)}`);
  }

  const numberItemId = parseInt(itemId, 10);

  return (
    <EditPageContent itemId={numberItemId} />
  );
}
