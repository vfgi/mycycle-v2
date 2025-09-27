import { z } from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "auth.signup.emailRequired")
      .email("auth.signup.emailInvalid"),
    password: z
      .string()
      .min(1, "auth.signup.passwordRequired")
      .min(6, "auth.signup.passwordMinLength"),
    confirmPassword: z.string().min(1, "auth.signup.confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.signup.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
