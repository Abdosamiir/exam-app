"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "../../schemas/auth.schema";

const ForgotPasswordForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    defaultValues: { email: "" },
    resolver: async (values) => {
      const result = forgotPasswordSchema.safeParse(values);
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
    mutationFn: async (data: ForgotPasswordSchema) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
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
    },
    onError: (err: Error) => {
      setFormError(err.message);
    },
  });

  if (success) {
    return (
      <div className="flex w-full px-4 md:px-0 md:w-1/2 max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight">
            Check your inbox
          </h1>
          <p className="text-sm text-muted-foreground">
            A reset link has been sent to your email if it has an associated
            account.
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm text-blue-600 underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
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
        <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your email"
                autoComplete="email"
              />
              <FieldDescription></FieldDescription>
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

      <Button
        disabled={isPending}
        className="capitalize text-white bg-blue-600 rounded-none p-4"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </Button>

      <Link
        href="/login"
        className="text-center text-sm text-blue-600 underline-offset-4 hover:underline"
      >
        Back to login
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
