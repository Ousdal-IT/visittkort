export function normalizeHttpUrl(value: string): string | undefined {
  const candidate = value.trim();
  if (!candidate) return undefined;

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(candidate);
  try {
    const url = new URL(hasScheme ? candidate : `https://${candidate}`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}
