export interface VocabEntity {
  id: number;
  text: string;
  plural_suffix?: string;
  translation?: string;
}

export interface LessonMetadata {
  lesson_date?: string;
  submission_date: string;
  description?: string;
}

export interface LessonData {
  entities: Array<VocabEntity>;
  metadata: LessonMetadata;
}


export type EmptyObject = Record<never, unknown>;
