import { lessonOne, testItemGroup } from '@/app/data/initdata';
import { getDataRepository } from '@/app/data';
import { z } from 'zod';
import { TableGroupAttributesSchema, TableVocabularyAttributesSchema } from '@/app/lib/schemas';
import { adaptKeysToCamelCase } from '@/app/lib/object-util';

const VocabularyItemSeedSchema = TableVocabularyAttributesSchema.omit({ id: true });
const VocabularyGroupSeedSchema = TableGroupAttributesSchema.omit({ id: true });

const VocabularySeedSchema = z.object({
  entities: z.array(VocabularyItemSeedSchema),
  group: VocabularyGroupSeedSchema,
});

type VocabularySeed = z.infer<typeof VocabularySeedSchema>;

export async function GET() {
  try {
    const parsedVocabularySeedDataLessonOne: VocabularySeed = VocabularySeedSchema.parse(lessonOne);
    const parsedVocabularySeedDataTestData: VocabularySeed = VocabularySeedSchema.parse(testItemGroup);

    const repo = getDataRepository();

    const adaptedLessonOneEntities = parsedVocabularySeedDataLessonOne.entities.map(entity => adaptKeysToCamelCase(entity));
    // const adaptedTestVocabularyItems = parsedVocabularySeedDataTestData.entities.map(entity => adaptKeysToCamelCase(entity));

    repo.createSchema();
    repo.insertAllIntoVocabulary(adaptedLessonOneEntities);
    repo.insertAllIntoGroups([parsedVocabularySeedDataLessonOne.group, parsedVocabularySeedDataTestData.group].map(group => adaptKeysToCamelCase(group)));

    const group = repo.findGroupByName(parsedVocabularySeedDataLessonOne.group.name);

    if (group === undefined) {
      throw new Error("Failed to fetch previously inserted group");
    }

    const insertedItems = repo.findAllVocabularyItems();

    if (insertedItems.length === 0) {
      throw new Error("Failed to fetch previously inserted items");
    }

    const groupings = insertedItems.map(item => ({ itemId: item.id, groupId: group.id }));
    repo.insertAllIntoVocabularyGrouping(groupings);

    return Response.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
