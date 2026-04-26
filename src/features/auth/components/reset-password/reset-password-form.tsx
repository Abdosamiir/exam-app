"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "../../schemas/auth.schema";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: async (values) => {
      const result = resetPasswordSchema.safeParse(values);
      if (result.success) return { values: result.data, errors: {} };
      return {
        values: {},
        errors: result.error.issues.reduce<
          Record<string, { message: string; type: string }>
        >((acc, issue) => {
          const key = String(issue.path[0]);
          acc[key] = { message: issue.message, type: issue.code };
          return acc;
        }, {}),
      };
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordSchema) => {
      if (!token) throw new Error("Invalid or missing reset token.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          }),
        },
      );

      const json = await response.json();

      if (!json.status) {
        throw new Error(
          json.message || "Something went wrong. Please try again.",
        );
      }

      return json;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormError(null);
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (err: Error) => {
      setFormError(err.message);
    },
  });

  if (!token) {
    return (
      <div className="flex w-1/2 max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Invalid link</h1>
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or has expired.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 underline-offset-4 hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex w-1/2 max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Password reset</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been updated. Redirecting you to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        setFormError(null);
        mutate(data);
      })}
      className="flex w-full px-4 md:px-0 md:w-1/2 max-w-sm flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight capitalize">
          Create new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new strong password for your account.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type={showPassword ? "text" : "password"}
                aria-invalid={fieldState.invalid}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <FieldDescription>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"} password
                </button>
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type={showPassword ? "text" : "password"}
                aria-invalid={fieldState.invalid}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <FieldDescription>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"} password
                </button>
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {formError && (
        <p role="alert" className="text-sm font-normal text-destructive">
          {formError}
        </p>
      )}
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          disabled={isPending}
          className="capitalize text-white bg-blue-600 w-full rounded-none p-4"
        >
          {isPending ? "Resetting…" : "Reset password"}
        </Button>
        <p className="text-center text-muted-foreground text-sm  underline-offset-4 hover:underline">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600">
            Create yours
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
