import { z } from "zod";
import type { TFunction } from "i18next";
import { phoneRegex } from "@/utils/regex";

const isValidDKPhone = phoneRegex.test.bind(phoneRegex);

export const createStaffSchema = (t: TFunction) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(2, t("fullNameMin", "Name must be at least 2 characters")),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(t("invalidEmail", "Please enter a valid email address")),
    phoneNumber: z
      .string()
      .trim()
      .refine(isValidDKPhone, {
        message: t("invalidDKPhone", "Phone must be 8 digits for Denmark"),
      }),
  });

export type StaffFormValues = z.infer<ReturnType<typeof createStaffSchema>>;

export const STAFF_DEFAULT_VALUES: StaffFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
};
