import { z } from 'zod';

// Database

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

export const TableVocabularyGroupingSchema = z.object({
  item_id: z.number().int().min(0),
  group_id: z.number().int().min(0),
});


// Local storage

export const SelectedItemsSchema = z.array(z.string());

