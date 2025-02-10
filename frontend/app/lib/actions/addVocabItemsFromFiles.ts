'use server';

import { z } from "zod";

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

