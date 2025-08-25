import { z } from 'zod';

/** Zod schema pentru o întrebare din baza de date */
export const QuestionSchema = z.object({
  id: z.number(),
  categorie: z.string(),
  intrebare: z.string(),
  variante: z.array(z.string()),
  raspunsCorect: z.string(),
  sursa: z.string().optional(),
});

/** Schema pentru lista de întrebări */
export const QuestionsArraySchema = z.array(QuestionSchema);

/** Schema pentru rezumate de materie */
export const RezumateSchema = z.record(
  z.object({
    titlu: z.string(),
    rezumat: z.string(),
    // sub-capitolele sunt înregistrate ca obiecte recursiv
    subcapitole: z.record(z.any()).optional(),
  })
);

export type Question = z.infer<typeof QuestionSchema>;
export type Rezumate = z.infer<typeof RezumateSchema>;
