export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamelCase<U>>}` : S;


/**
 * This trick will work as long as we have string keys!
 */
export type CamelCaseKeys<TInput> = {
  [K in keyof TInput as SnakeToCamelCase<K & string>]: TInput[K]
}
