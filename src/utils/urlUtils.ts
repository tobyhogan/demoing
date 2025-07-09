export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function findDeckBySlug(decks: Array<{id: string, name: string}>, slug: string): string | null {
  const deck = decks.find(deck => createSlug(deck.name) === slug);
  return deck ? deck.id : null;
}
