export class EmptyVocabularyListError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
