import { z } from 'zod';

export const TableGroupAttributesSchema = z.object({
  id: z.number().int().min(0),
  name: z.string().min(1),
  description: z.string().nullable(),
  created_date: z.string().datetime({ offset: true }),
});

export const TableVocabularyAttributesSchema = z.object({
  id: z.number().int().min(0),
  text: z.string().min(1),
  translation: z.string().nullable(),
  created_date: z.string().datetime({ offset: true }),
  last_updated_date: z.string().datetime({ offset: true }),
});

