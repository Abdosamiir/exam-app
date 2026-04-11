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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";

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
      router.push("/dashboard");
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

      <Button
        disabled={isPending}
        className=" capitalize text-white rounded-none p-4 "
        style={{
          background: "#155dfc",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
};

export default LoginForm;
