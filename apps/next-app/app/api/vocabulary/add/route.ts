import { execSync } from "child_process";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { VocabularyItemGroupWoId, VocabularyItemWoId } from "@/app/lib/definitions";
import { getDataRepository } from "@/app/data";
import { SqliteError } from 'better-sqlite3';
import { revalidatePath } from "next/cache";

function parseVocabularyFile(path: string) {
  const stdout_content = execSync(`./scripts/main.py --stdout --camel-case --no-pretty ${path}`);
  const object = JSON.parse(stdout_content.toString());
  return object;
}

function isFile(maybeFile: unknown): maybeFile is File {
  return typeof maybeFile === 'object' && maybeFile instanceof File
}

async function ensureTmpFolderExists(folder: string) {
  await fs.mkdir(folder, { recursive: true });
}

async function rmTmpFolder(folder: string) {
  await fs.rm(folder, { recursive: true });
}

async function saveFileToFolder(file: File, folder: string) {
  const path = folder + `/${file.name}`
  await fs.writeFile(path, await file.text(), { flag: 'a', flush: true });
  return path;
}

function resolveGroupId(data: FormData): number | null {
  if (!data.has('groupId')) {
    return null;
  }

  const unknownId = data.get('groupId');

  if (!unknownId || !(typeof unknownId === 'string')) {
    console.log(`Invalid type of groupId! Expected: "string", got "${typeof unknownId}"`);
    return null;
  }

  const stringId = unknownId as string;

  let numberId: number | null = null;
  try {
    numberId = parseInt(stringId);
  } catch (error) {
    console.warn(`Failed to parse groupId: ${stringId} with error: ${error}`);
  }

  return numberId;
}

export async function POST(request: NextRequest) {
  const data = await request.formData();

  if (!data.has('selectedFiles')) {
    // Bad request
    return new Response(null, { status: 400 });
  }

  const selectedFiles = data.getAll('selectedFiles');

  if (!Array.isArray(selectedFiles)) {
    // Bad request
    return new Response(null, { status: 400 });
  }

  const uid = nanoid();
  const tmpFolder = `/var/tmp/vocabtrainer/session-${uid}`;

  type OutputType = Array<{ entities: Array<VocabularyItemWoId>, group: VocabularyItemGroupWoId }>;
  type LegacyOutputType = Array<OutputType>;

  let parsingOutput: LegacyOutputType;

  try {
    await ensureTmpFolderExists(tmpFolder);

    const inputPaths = await Promise.all(selectedFiles.map(file => {
      if (isFile(file)) {
        return saveFileToFolder(file, tmpFolder);
      } else {
        return null
      }
    }));

    parsingOutput = inputPaths.map(path => {
      if (path !== null) {
        return parseVocabularyFile(path);
      } else {
        return 'not-a-file';
      }
    });
    await rmTmpFolder(tmpFolder);
  } catch (error) {
    // Server error
    console.error('Server error', error);
    return new Response(undefined, { status: 500 });
  } finally {
  }


  // null or undefined
  if (parsingOutput == null) {
    return new Response('failed to process input', { status: 500 });
  }

  const preparedData: OutputType = parsingOutput.flat(1);

  const groupId = resolveGroupId(data);

  // save data to db
  try {
    const repo = getDataRepository();
    const items = preparedData.map(data => data.entities).flat(1);

    if (groupId) {
      repo.insertVocabularyItemsWithGroupId(items, groupId);
    } else {
      repo.insertAllIntoVocabulary(items);
    }

    revalidatePath('/vocabulary/');
  } catch (error) {
    const errorAsJson = JSON.stringify(error);
    if (error instanceof SqliteError) {
      console.error('DB operation error', errorAsJson);
      return new Response(errorAsJson, { status: 400 })
    }

    console.error('Server error', error);
    return new Response(errorAsJson, { status: 500 });
  }

  return new Response(undefined, { status: 200 });
}

