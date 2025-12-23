import { z } from "zod";

export const productTypesSchema = z.object({
  name: z.string().min(3),
});
export type ProductTypesFormType = z.infer<typeof productTypesSchema>;
