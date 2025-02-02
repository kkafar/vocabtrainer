import { execSync } from "child_process";
import fs from "fs/promises";
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";
import createDatabaseConnection from "@/app/data/database";

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

type VocabularyItemRecord = Omit<VocabularyItem, 'id'>;
type VocabularyGroupRecord = Omit<VocabularyItemGroup, 'id'>;

export async function POST(request: NextRequest) {
  const data  = await request.formData();

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

  type OutputType = Array<{ entities: Array<VocabularyItemRecord>, group: VocabularyGroupRecord }>;
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
    return new Response(null, { status: 500 });
  }


  // null or undefined
  if (parsingOutput == null) {
    return new Response('failed to process input', { status: 500 });
  }

  const preparedData: OutputType = parsingOutput.flat(1);

  // save data to db
  try {
    const conn = createDatabaseConnection();

    const query = conn.prepare<VocabularyItemRecord>(`
      INSERT INTO vocabulary (text, translation, created_date, last_updated_date) VALUES ($text, $translation, $createdDate, $lastUpdatedDate);
    `);

    const transaction = conn.transaction((output: OutputType) => {
      output.forEach((group: OutputType[0]) => {
        group.entities.forEach(entity => query.run(entity));
      })
    });

    transaction(preparedData);

  } catch (error) {
    console.error('Server error', error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
