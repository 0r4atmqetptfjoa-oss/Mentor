export type Flashcard = { topic: string; front: string; back: string; createdAt: number };

export async function generateFlashcardsFromSummary(topic: string, text: string): Promise<Flashcard[]> {
  const { default: nlp } = await import('compromise');
  const doc = nlp(text);
  const terms = Array.from(new Set(
    doc
      .nouns()
      .toSingular()
      .out('array')
      .filter((w: string) => w.length >= 3 && w.length <= 30)
  )).slice(0, 60);
  const sents = text.split(/(?<=[.!?])\s+/);
  const findSent = (term: string) => sents.find((s) => s.toLowerCase().includes(term.toLowerCase())) || sents[0] || '';
  const now = Date.now();
  return terms.map((t) => ({ topic, front: `Definește: ${t}`, back: findSent(t).slice(0, 200), createdAt: now }));
}
