import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(200, "Máximo 200 caracteres")
    .trim(),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
