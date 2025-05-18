export function isStringBlank(str?: string | null): boolean {
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

export function camelCaseFromSnakeCase(str: string): string | null {
  const parts = str.trim().split('_');

  if (parts.length === 0) {
    return null;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  for (let i = 1; i < parts.length; i++) {
    parts[i] = capitalize(parts[i]);
  }

  return parts.join('');
}
