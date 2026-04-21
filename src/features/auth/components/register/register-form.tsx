"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { registerSchema, RegisterSchema } from "../../schemas/auth.schema";

type RegisterFormFields = RegisterSchema & { code: string };

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterFormFields>({
    defaultValues: {
      email: "",
      code: "",
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-email-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload?.message || "Failed to send verification code.",
        );
      }
      return payload;
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code,
          }),
        },
      );

      const payload = await response.json();
      if (!response.ok) {
        const errorMessage = Array.isArray(payload?.message)
          ? payload.message.join(", ")
          : payload?.message;
        throw new Error(errorMessage || "Invalid verification code.");
      }
      return payload;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const parsed = registerSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          parsed.error.issues[0]?.message || "Invalid form data.",
        );
      }

      if (parsed.data.password !== parsed.data.confirmPassword) {
        throw new Error("Password and confirm password must match.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to register account.");
      }
      return payload;
    },
    onSuccess: () => {
      setStep(1);
      setFormError(null);
      form.reset();
    },
  });

  const nextFromEmail = async () => {
    setFormError(null);
    const isValid = await form.trigger("email");
    if (!isValid) return;

    const email = form.getValues("email");
    try {
      await sendOtpMutation.mutateAsync(email);
      setStep(2);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  const nextFromCode = async () => {
    setFormError(null);
    const isValid = await form.trigger("code");
    if (!isValid) return;

    const email = form.getValues("email");
    const code = form.getValues("code");
    try {
      await verifyOtpMutation.mutateAsync({ email, code });
      setStep(3);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  const nextFromProfile = async () => {
    setFormError(null);
    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "username",
      "phone",
    ]);
    if (!isValid) return;
    setStep(4);
  };

  const submitRegister = async () => {
    setFormError(null);
    const isValid = await form.trigger(["password", "confirmPassword"]);
    if (!isValid) return;

    const data = form.getValues();
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex w-1/2 max-w-sm flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div>

      <div className="flex flex-col gap-4">
        {step === 1 && (
          <Controller
            name="email"
            control={form.control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
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
                <FieldDescription>
                  We will send a verification code to this email.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {step === 2 && (
          <Controller
            name="code"
            control={form.control}
            rules={{
              required: "Verification code is required",
              minLength: {
                value: 4,
                message: "Verification code is too short",
              },
            }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter verification code"
                  autoComplete="one-time-code"
                />
                <FieldDescription>
                  Enter the code sent to {form.getValues("email")}.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {step === 3 && (
          <>
            <Controller
              name="firstName"
              control={form.control}
              rules={{ required: "First name is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              rules={{ required: "Last name is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="username"
              control={form.control}
              rules={{ required: "Username is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Choose username"
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              rules={{ required: "Phone is required" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </>
        )}

        {step === 4 && (
          <>
            <Controller
              name="password"
              control={form.control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Create password"
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
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Password and confirm password must match.",
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-sm font-normal text-destructive">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-2">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => {
              setFormError(null);
              setStep((prev) => prev - 1);
            }}
          >
            Back
          </Button>
        )}

        {step === 1 && (
          <Button
            type="button"
            disabled={sendOtpMutation.isPending}
            onClick={nextFromEmail}
            className="capitalize text-white bg-blue-600 rounded-none p-4"
          >
            {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
          </Button>
        )}

        {step === 2 && (
          <Button
            type="button"
            disabled={verifyOtpMutation.isPending}
            onClick={nextFromCode}
            className="capitalize text-white bg-blue-600 rounded-none p-4"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
          </Button>
        )}

        {step === 3 && (
          <Button
            type="button"
            onClick={nextFromProfile}
            className="capitalize text-white bg-blue-600 rounded-none p-4"
          >
            Continue
          </Button>
        )}

        {step === 4 && (
          <Button
            type="button"
            disabled={registerMutation.isPending}
            onClick={submitRegister}
            className="capitalize text-white bg-blue-600 rounded-none p-4"
          >
            {registerMutation.isPending ? "Creating..." : "Create Account"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default RegisterForm;
