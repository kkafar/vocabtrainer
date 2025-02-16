'use server';

import { getDataRepository } from "@/app/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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

