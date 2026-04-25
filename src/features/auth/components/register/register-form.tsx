"use client";

import { useEffect, useRef, useState } from "react";
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
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type RegisterFormFields = RegisterSchema & { code: string };

const OTP_LENGTH = 6;

const OtpInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? ""),
  );
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string[]) => {
    setDigits(next);
    onChange(next.join(""));
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    commit(next);
    if (char && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        commit(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        commit(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    commit(next);
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex justify-center items-center gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="h-12 w-12  border border-gray-300 text-center text-lg font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

const TOTAL_STEPS = 4;

const StepProgress = ({ current }: { current: number }) => (
  <div className="flex items-center w-full">
    {Array.from({ length: TOTAL_STEPS }, (_, i) => {
      const step = i + 1;
      const isDone = step < current;
      const isActive = step === current;
      const isLast = step === TOTAL_STEPS;

      return (
        <div key={i} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
          {/* Diamond node */}
          <div
            className={`relative flex shrink-0 rotate-45 items-center justify-center transition-all duration-300 ${
              isActive ? "h-5 w-5" : "h-3.5 w-3.5"
            } ${
              isDone || isActive
                ? "bg-blue-600"
                : "border-2 border-blue-300 bg-white"
            }`}
          >
            {isActive && <span className="block h-2 w-2 bg-white" />}
          </div>

          {/* Connector */}
          {!isLast && (
            <div
              className={`flex-1 ${
                isDone
                  ? "h-0.5 bg-blue-600"
                  : "border-t-2 border-dashed border-blue-300"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

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

  const goBackToEmail = () => {
    setFormError(null);
    setStep(1);
    setTimeout(() => form.setFocus("email"), 0);
  };

  const nextFromEmail = async () => {
    setFormError(null);
    const isValid = await form.trigger("email");
    if (!isValid) return;

    const email = form.getValues("email");
    try {
      await sendOtpMutation.mutateAsync(email);
      setStep(2);
      setCountdown(60);
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
      className="flex w-full px-4 md:px-0 md:w-1/2 max-w-sm flex-col gap-6"
    >
      {/* <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div> */}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight ">Create Account</h1>
        </div>

        {step >= 2 && <StepProgress current={step} />}
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
                  placeholder="user@example.com"
                  autoComplete="email"
                />
                <FieldDescription></FieldDescription>
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
                <FieldLabel
                  htmlFor={field.name}
                  className="text-blue-600 font-bold text-2xl"
                >
                  Verify OTP
                </FieldLabel>
                <FieldDescription>
                  Please enter the 6-digits code we have sent to:{" "}
                  {form.getValues("email")}.{" "}
                  <button
                    type="button"
                    onClick={goBackToEmail}
                    className="text-blue-600 hover:underline underline-offset-4"
                  >
                    Edit
                  </button>
                </FieldDescription>
                <OtpInput value={field.value} onChange={field.onChange} />
                <div className="text-sm text-muted-foreground text-center">
                  {countdown > 0 ? (
                    <span>
                      You can request another code in:{" "}
                      <span className="font-semibold text-blue-600 tabular-nums">
                        {countdown}s
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={sendOtpMutation.isPending}
                      onClick={async () => {
                        const email = form.getValues("email");
                        try {
                          await sendOtpMutation.mutateAsync(email);
                          setCountdown(60);
                          setFormError(null);
                        } catch (error) {
                          setFormError(
                            error instanceof Error
                              ? error.message
                              : "Failed to resend code.",
                          );
                        }
                      }}
                      className="text-blue-600 hover:underline underline-offset-4 disabled:opacity-50"
                    >
                      {sendOtpMutation.isPending ? "Sending…" : "Resend code"}
                    </button>
                  )}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {step === 3 && (
          <>
            <div className="flex items-center gap-2">
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
                      placeholder="first name"
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
                      placeholder="last name"
                      autoComplete="family-name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

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
                    placeholder="user123"
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
                    placeholder="+1234567890"
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
            <h1 className="text-2xl font-bold text-blue-600 ">
              Create strong Password
            </h1>
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
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Create password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>

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
        {/* {step > 1 && (
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
        )} */}

        {step === 1 && (
          <div className="flex flex-col w-full gap-4">
            <Button
              type="button"
              disabled={sendOtpMutation.isPending}
              onClick={nextFromEmail}
              className="capitalize  bg-blue-50 border-blue-500 border text-gray-800 w-full hover:text-white  rounded-none p-5"
            >
              {sendOtpMutation.isPending ? "Sending..." : "Next"}
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <Button
            type="button"
            disabled={verifyOtpMutation.isPending}
            onClick={nextFromCode}
            className="capitalize text-blue-600 hover:text-white w-full bg-blue-50 rounded-none p-5"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
          </Button>
        )}

        {step === 3 && (
          <Button
            type="button"
            onClick={nextFromProfile}
            className="capitalize text-blue-600 hover:text-white w-full bg-blue-50 rounded-none p-5"
          >
            Next
          </Button>
        )}

        {step === 4 && (
          <Button
            type="button"
            disabled={registerMutation.isPending}
            onClick={submitRegister}
            className="capitalize text-white w-full bg-blue-600 rounded-none p-5"
          >
            {registerMutation.isPending ? "Creating..." : "Create Account"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default RegisterForm;
