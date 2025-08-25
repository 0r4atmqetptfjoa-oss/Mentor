import { QuestionsArraySchema, RezumateSchema, type Question, type Rezumate } from './types';

/**
 * Sursele implicite pentru datele aplicației.
 * Pot fi înlocuite cu URL-uri sau obiecte File în Settings.
 */
export const defaultSources = {
  intendenta: '/data/questions_intendenta.json',
  psihologic: '/data/questions_psihologic.json',
  engleza: '/data/questions_engleza.json',
  rezumate: '/data/rezumate_materie.json',
} as const;

/**
 * Încarcă și validează un fișier JSON, acceptând string URL sau File.
 * @param {string|File} source
 */
async function loadJSON(source: string | File): Promise<unknown> {
  if (typeof source === 'string') {
    const res = await fetch(source);
    return res.json();
  }
  const text = await source.text();
  return JSON.parse(text);
}

/**
 * Încarcă toate bazele de date și le validează cu Zod.
 * @param {Partial<typeof defaultSources>} [sources]
 */
export async function loadAll(sources: Partial<typeof defaultSources> = {}) {
  const cfg = { ...defaultSources, ...sources };
  const [intData, psiData, engData] = await Promise.all([
    loadJSON(cfg.intendenta),
    loadJSON(cfg.psihologic),
    loadJSON(cfg.engleza),
  ]);
  const rezData = await loadJSON(cfg.rezumate);

  return {
    intendenta: QuestionsArraySchema.parse(intData).map(normalizeQuestion),
    psihologic: QuestionsArraySchema.parse(psiData).map(normalizeQuestion),
    engleza: QuestionsArraySchema.parse(engData).map(normalizeQuestion),
    rezumate: RezumateSchema.parse(rezData),
  } as {
    intendenta: Question[];
    psihologic: Question[];
    engleza: Question[];
    rezumate: Rezumate;
  };
}

function normalizeQuestion(q: Question): Question {
  return { ...q, categorie: q.categorie.trim() };
}
