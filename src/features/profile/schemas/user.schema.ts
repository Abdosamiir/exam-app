import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  profilePhoto: z.string().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  newEmail: z.email("Invalid email address"),
});

export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;

export const confirmEmailSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
});

export type ConfirmEmailSchema = z.infer<typeof confirmEmailSchema>;
