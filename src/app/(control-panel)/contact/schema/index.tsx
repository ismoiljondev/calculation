import { isValidPhoneNumber } from "react-phone-number-input";

import i18next from "i18next";
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: i18next.t("required_field", { ns: "general" }) }),
  phone: z
    .string({ required_error: i18next?.t("missing_phone", { ns: "general" }) })
    .refine((data) => isValidPhoneNumber(data), {
      message: i18next?.t("invalid_phone", { ns: "general" }),
    }),
});
export type ContactFormType = z.infer<typeof contactSchema>;
