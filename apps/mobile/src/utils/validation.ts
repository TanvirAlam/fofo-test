import { z } from "zod";
import { validatePhone } from "./helpers";

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .refine(
        (v) => validatePhone(v) === true,
        (v) => {
          const res = validatePhone(v);
          return {
            message: res === true ? "Invalid phone" : String(res),
          };
        }
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Phone is required")
    .refine(
      (v) => v.includes("@") || validatePhone(v) === true,
      "Must be a valid email or phone number"
    ),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
