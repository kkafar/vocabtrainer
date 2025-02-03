'use server';

import { z } from "zod";
import { getDataRepository } from "@/app/data/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export type AddGroupFormState = {
  errors?: {
    name?: string[],
    description?: string[],
  },
  message?: string | null,
};

const AddGroupDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})


export async function createVocabItemGroup(state: AddGroupFormState, formData: FormData): Promise<AddGroupFormState> {
  console.log('createVocabItemGroup');

  const parsedData = AddGroupDataSchema.safeParse({
    name: formData.get('groupName'),
    description: formData.get('groupDesc'),
  });

  if (!parsedData.success) {
    console.error('Error while parsing arguments')
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Failed to parse form data",
    };
  }

  const { name, description = null } = parsedData.data;

  try {
    const repo = getDataRepository();

    const createdDate = new Date().toISOString();
    const info = repo.insertIntoGroups({ name, description, createdDate });

    if (info.changes !== 1) {
      console.error(`Invalid count of affected rows! Expected: 1, got: ${info.changes}`);
      return {
        message: `Invalid count of affected rows! Expected: 1, got: ${info.changes}`,
      };
    }
  } catch (error) {
    console.error('Error thrown while inserting item into db', JSON.stringify(error));
    return {
      message: (error as Error).toString(),
    }
  } finally {
    revalidatePath('/vocabulary');
    redirect('/vocabulary');
  }
}

export type AddVocabItemsFromFilesFormState = {
  errors?: {
    selectedFiles?: string[],
  },
  message?: string | null,
};

const AddVocabItemsFromFilesDataSchema = z.object({
  selectedFiles: z.array(z.instanceof(File)),
})


export async function addVocabItemsFromFiles(state: AddVocabItemsFromFilesFormState, formData: FormData): Promise<AddVocabItemsFromFilesFormState> {
  console.log(addVocabItemsFromFiles.name);

  console.log('Selectedfiles', formData.get('selectedFiles'));

  const parsedData = AddVocabItemsFromFilesDataSchema.safeParse({
    selectedFiles: formData.get('selectedFiles'),
  });

  if (!parsedData.success) {
    console.error('Failed to parse form data');
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: 'Failed to parse files selected by user. Maybe "selectedFiles" field was missing?',
    }
  }

  // const { selectedFiles } = parsedData.data;

  console.log('Properly received files to parse');

  return {
    message: 'success'
  }
}

