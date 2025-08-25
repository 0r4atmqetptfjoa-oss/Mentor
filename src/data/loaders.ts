import { z, ZodType } from 'zod';

export async function loadJson<T>(path: string, schema: ZodType<T>, fallback: T): Promise<T> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    return schema.parse(json);
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
    return fallback;
  }
}

export const questionSchema = z.object({
  question: z.string(),
  answers: z.array(z.string()),
  correct: z.number()
});

