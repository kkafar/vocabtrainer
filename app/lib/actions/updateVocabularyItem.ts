'use server';

import { getDataRepository } from "@/app/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const VocabItemSchema = z.object({
  text: z.string().min(1),
  translation: z.string(),
  category: z.enum(['vocabulary']),
});

export type State = {
  errors?: {
    text?: string[],
    translation?: string[],
    category?: string[],
    database?: string,
  },
  message?: string | null,
}

export async function updateVocabItem(itemId: number, state: State, formData: FormData): Promise<State> {
  console.log('updateVocabItem');

  const parsedData = VocabItemSchema.safeParse({
    text: formData.get('text'),
    translation: formData.get('translation'),
    category: formData.get('category'),
  });

  if (!parsedData.success) {
    console.error('Error while parsing arguments');
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Failed to update vocabulary item",
    }
  }

  const { text, translation } = parsedData.data;
  // const date = new Date().toISOString();

  try {
    const repo = getDataRepository();

    const info = repo.updateVocabularyByIdWithTextAndTranslation({ id: itemId, text, translation });

    if (info.changes !== 1) {
      console.error('Error while inserting items to db');
      return {
        errors: {
          database: 'wrong-change-number'
        },
        message: `Unexpected number of changes: ${info.changes}. Expected: 1`,
      };
    }

  } catch (error) {
    const errorValue = {
      errors: {
        database: (error as Error).toString(),
      },
      message: "Error while updating the vocab item",
    }

    console.error('Error thrown while inserting item to db', JSON.stringify(errorValue));

    return errorValue;
  } finally {
    revalidatePath("/cards");
    redirect(`/cards`);
  }
}

