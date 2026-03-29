/** Normalize tag for search/storage: lowercase, no whitespace. */
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "");
}
