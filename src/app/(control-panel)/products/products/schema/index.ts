import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(3),
  unit: z.enum(["PIECE", "METER", "SQUAREMETER", "KILOGRAMM"]),
});
export type ProductFormType = z.infer<typeof productSchema>;
