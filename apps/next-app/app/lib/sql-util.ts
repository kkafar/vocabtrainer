export function sql(strings: TemplateStringsArray, ...values: string[]): string {
  if (values.length > 0) {
    throw new Error("sql tagged template does not accept any values!");
  }
  return strings.join('');
}

