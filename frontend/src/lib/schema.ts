import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 charaters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be atleast 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and condition" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
