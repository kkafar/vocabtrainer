import { camelCaseFromSnakeCase } from "./text-util";
import { CamelCaseKeys } from "./type-magic";


export function adaptKeysToCamelCase<T extends Record<string, unknown>>(object: T): CamelCaseKeys<T> {
  const resultObject: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(object)) {
    const adaptedKey = camelCaseFromSnakeCase(key);
    if (adaptedKey == null) {
      throw new Error('Failed to convert keys of object to camel case');
    }
    resultObject[adaptedKey] = value;
  }
  return resultObject as CamelCaseKeys<T>;
}
