import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.login.emailRequired')
    .email('auth.login.emailInvalid'),
  password: z
    .string()
    .min(1, 'auth.login.passwordRequired')
    .min(6, 'auth.login.passwordMinLength'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
