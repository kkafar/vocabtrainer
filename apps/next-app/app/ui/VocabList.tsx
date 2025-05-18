'use server';

import { fetchWordList } from "@/app/lib/data";

export default async function VocabList() {
  const vocab = await fetchWordList();

  return (
    <div className="flex-column justify-center items-center bg-background space-y-3">
      {vocab.map(entity => (
        <div key={entity.text} className='flex justify-center'>
          <div className="flex justify-center bg-mainlight w-3/4 py-2 rounded-lg hover:bg-mainheavy">
            <div className="text-lg font-medium">
              {entity.text} - {entity.translation}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

