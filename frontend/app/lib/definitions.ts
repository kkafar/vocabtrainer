import { z } from "zod";
import { TableGroupAttributesSchema, TableVocabularyAttributesSchema } from './schemas';
import { CamelCaseKeys } from "./type-magic";

export type TableGroupAttributes = z.infer<typeof TableGroupAttributesSchema>;
export type TableVocabularyAttributes = z.infer<typeof TableVocabularyAttributesSchema>;

export type VocabularyItem = CamelCaseKeys<TableVocabularyAttributes>;
export type VocabularyItemGroup = CamelCaseKeys<TableGroupAttributes>;

export type VocabularyItemWoId = Omit<VocabularyItem, 'id'>;
export type VocabularyItemGroupWoId = Omit<VocabularyItemGroup, 'id'>;

export type EmptyObject = Record<never, never>;
