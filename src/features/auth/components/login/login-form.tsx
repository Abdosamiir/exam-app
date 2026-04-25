"use client";

import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { loginSchema, LoginSchema } from "../../schemas/auth.schema";

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    defaultValues: { username: "abdulrahman38", password: "Abdulrahman@123" },
    resolver: async (values) => {
      const result = loginSchema.safeParse(values);
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

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid username or password.");
      }

      return result;
    },
    onSuccess: () => {
      router.push("/diplomas");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutate(data))}
      className="flex w-1/2 max-w-sm flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your username"
                autoComplete="username"
              />
              <FieldDescription></FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <FieldDescription></FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-normal text-destructive">
          {error.message}
        </p>
      )}

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        disabled={isPending}
        className=" capitalize text-white bg-blue-600  rounded-none p-4 "
      >
        {isPending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
};

export default LoginForm;
