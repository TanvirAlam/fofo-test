import { z } from "zod";
import type { TFunction } from "i18next";
import { cvrRegex, phoneRegex } from "../../regex";

export const isValidDKPhone = phoneRegex.test.bind(phoneRegex);

export const isValidCVR = cvrRegex.test.bind(cvrRegex);

export const createManagerSchema = (t: TFunction) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        t("validation.fullName.min", "Name must be at least 2 characters")
      ),
    email: z
      .string()
      .trim()
      .min(1, t("validation.email.required", "Email is required"))
      .email(t("validation.email.invalid", "Enter a valid email")),
    phoneNumber: z
      .string()
      .trim()
      .min(1, t("validation.phone.required", "Phone number is required"))
      .refine(isValidDKPhone, {
        message: t(
          "validation.phone.dkFormat",
          "Enter a valid Danish phone number (8 digits)"
        ),
      }),
    restaurantName: z
      .string()
      .trim()
      .min(
        1,
        t("validation.restaurantName.required", "Restaurant name is required")
      ),
    restaurantAddress: z
      .string()
      .trim()
      .min(
        1,
        t(
          "validation.restaurantAddress.required",
          "Restaurant address is required"
        )
      ),
    cvrNumber: z
      .string()
      .trim()
      .min(1, t("validation.cvr.required", "CVR number is required"))
      .refine(isValidCVR, {
        message: t("validation.cvr.dkFormat", "CVR must be exactly 8 digits"),
      }),
  });

export type ManagerSchema = ReturnType<typeof createManagerSchema>;
export type ManagerFormValues = z.infer<ReturnType<typeof createManagerSchema>>;
