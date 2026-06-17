"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

import { useChangePassword } from "../../hooks/use-user";
import {
  changePasswordSchema,
  ChangePasswordSchema,
} from "../../schemas/user.schema";

const ChangePasswordForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const form = useForm<ChangePasswordSchema>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (data: ChangePasswordSchema) => {
    setFormError(null);
    setFormSuccess(null);
    changePassword(data, {
      onSuccess: async (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to change password.");
          return;
        }
        // The old session must not survive a password change.
        setFormSuccess("Password changed successfully. Signing you out…");
        await signOut({ callbackUrl: "/login" });
      },
      onError: () => setFormError("Something went wrong."),
    });
  };

  return (
    <div className=" space-y-8 bg-white p-4">
   

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
        {formSuccess && (
          <p role="status" className="text-sm text-green-600">
            {formSuccess}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary w-full text-white hover:bg-primary/90 rounded-none px-6 py-5 capitalize"
          >
            {isPending ? "Saving…" : "update password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
