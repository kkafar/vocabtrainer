export function isStringBlank(str?: string): boolean {
  if (str == null) {
    return true;
  }

  if (str.length === 0 || str.trimStart().length === 0) {
    return true;
  }

  return false;
}
