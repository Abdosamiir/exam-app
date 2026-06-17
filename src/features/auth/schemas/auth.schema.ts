import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email address"),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Confirm password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

// Schema backing the multistep register form. Each step validates its own
// fields against this schema via react-hook-form's `trigger`.
export const registerFormSchema = registerSchema
  .extend({
    code: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password and confirm password must match.",
    path: ["confirmPassword"],
  });
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
