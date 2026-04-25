"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

import { useRequestEmailChange, useConfirmEmailChange } from "../../hooks/use-user";
import {
  changeEmailSchema,
  ChangeEmailSchema,
  confirmEmailSchema,
  ConfirmEmailSchema,
} from "../../schemas/user.schema";

type Step = "idle" | "request" | "confirm";

interface Props {
  currentEmail: string;
}

const ChangeEmailSection = ({ currentEmail }: Props) => {
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestForm = useForm<ChangeEmailSchema>({
    defaultValues: { newEmail: "" },
    resolver: async (values) => {
      const result = changeEmailSchema.safeParse(values);
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

  const codeForm = useForm<ConfirmEmailSchema>({
    defaultValues: { code: "" },
    resolver: async (values) => {
      const result = confirmEmailSchema.safeParse(values);
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

  const { mutate: requestEmail, isPending: isRequesting } =
    useRequestEmailChange();
  const { mutate: confirmEmail, isPending: isConfirming } =
    useConfirmEmailChange();

  const onSendCode = (data: ChangeEmailSchema) => {
    setError(null);
    requestEmail(data.newEmail, {
      onSuccess: (res) => {
        if (!res.status) {
          setError(res.message ?? "Failed to send code.");
          return;
        }
        setStep("confirm");
      },
      onError: () => setError("Something went wrong."),
    });
  };

  const onConfirmCode = (data: ConfirmEmailSchema) => {
    setError(null);
    confirmEmail(data.code, {
      onSuccess: (res) => {
        if (!res.status) {
          setError(res.message ?? "Invalid code.");
          return;
        }
        setStep("idle");
        requestForm.reset();
        codeForm.reset();
      },
      onError: () => setError("Something went wrong."),
    });
  };

  const cancel = () => {
    setStep("idle");
    setError(null);
    requestForm.reset();
    codeForm.reset();
  };

  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="email"
            value={currentEmail}
            readOnly
            className="cursor-not-allowed opacity-60"
          />
          {step === "idle" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                setStep("request");
                setError(null);
              }}
            >
              Change
            </Button>
          )}
        </div>
      </Field>

      {step === "request" && (
        <div className="rounded-md border bg-gray-50 p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Enter your new email — a verification code will be sent to it
          </p>
          <form onSubmit={requestForm.handleSubmit(onSendCode)} className="space-y-3">
            <Controller
              name="newEmail"
              control={requestForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="new@email.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isRequesting}
              >
                {isRequesting ? "Sending…" : "Send code"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={cancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === "confirm" && (
        <div className="rounded-md border bg-gray-50 p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Enter the 6-digit code sent to your new email
          </p>
          <form onSubmit={codeForm.handleSubmit(onConfirmCode)} className="space-y-3">
            <Controller
              name="code"
              control={codeForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="123456"
                    maxLength={6}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isConfirming}
              >
                {isConfirming ? "Confirming…" : "Confirm"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("request");
                  codeForm.reset();
                  setError(null);
                }}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangeEmailSection;
