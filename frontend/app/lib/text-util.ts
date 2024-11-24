export function isStringBlank(str?: string): boolean {
  if (str == null) {
    return true;
  }

  if (str.length === 0 || str.trimStart().length === 0) {
    return true;
  }

  return false;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

