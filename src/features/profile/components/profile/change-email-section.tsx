"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { PencilLine } from "lucide-react";

import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";

import {
  useRequestEmailChange,
  useConfirmEmailChange,
} from "../../hooks/use-user";
import {
  changeEmailSchema,
  ChangeEmailSchema,
  confirmEmailSchema,
  ConfirmEmailSchema,
} from "../../schemas/user.schema";

type Step = "request" | "confirm";

interface Props {
  currentEmail: string;
}

const COUNTDOWN_SECONDS = 60;

const ChangeEmailSection = ({ currentEmail }: Props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("request");
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const startCountdown = () => {
    setCountdown(COUNTDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const onSendCode = (data: ChangeEmailSchema) => {
    setError(null);
    requestEmail(data.newEmail, {
      onSuccess: (res) => {
        if (!res.status) {
          setError(res.message ?? "Failed to send code.");
          return;
        }
        setNewEmail(data.newEmail);
        setOtp(["", "", "", "", "", ""]);
        codeForm.reset();
        setStep("confirm");
        startCountdown();
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
        closeAndReset();
      },
      onError: () => setError("Something went wrong."),
    });
  };

  const closeAndReset = () => {
    setOpen(false);
    setStep("request");
    setError(null);
    setNewEmail("");
    setOtp(["", "", "", "", "", ""]);
    requestForm.reset();
    codeForm.reset();
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(0);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    codeForm.setValue("code", next.join(""));

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? "";
    setOtp(next);
    codeForm.setValue("code", next.join(""));
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <>
      <Field>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="shrink-0 bg-transparent self-end"
              onClick={() => {
                setOpen(true);
                setStep("request");
                setError(null);
              }}
            >
              <PencilLine />
              Change
            </Button>
          </div>
          <Input
            id="email"
            value={currentEmail}
            readOnly
            className="cursor-not-allowed opacity-60"
          />
        </div>
      </Field>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) closeAndReset();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="p-4 overflow-hidden rounded-none max-w-1/3"
        >
          {/* stepper */}
          <div className="relative flex items-center justify-between px-4 pt-6 pb-0">
            <div className="absolute left-10 right-10 top-[calc(1.5rem+8px)] h-px border-t-2 border-dashed border-blue-200" />
            {[0, 1].map((i) => {
              const active = i === 0 ? true : step === "confirm";
              return (
                <div
                  key={i}
                  className={`relative z-10 size-4 rotate-45 border-2 ${
                    active
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-blue-400"
                  }`}
                />
              );
            })}
            <button
              onClick={closeAndReset}
              className="absolute right-0 top-0 z-20 rounded opacity-70 hover:opacity-100"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* body */}
          <div className="px-5 pt-5 pb-0">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Change Email
            </h2>

            {step === "request" && (
              <>
                <p className="text-blue-600 font-semibold mb-5">
                  Enter your new email
                </p>
                <form
                  id="change-email-form"
                  onSubmit={(e) => requestForm.handleSubmit(onSendCode)(e)}
                  className="space-y-4"
                >
                  <Controller
                    name="newEmail"
                    control={requestForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="new-email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="new-email"
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="user@example.com"
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
                </form>
              </>
            )}

            {step === "confirm" && (
              <>
                <p className="text-blue-600 font-semibold mb-1">Verify OTP</p>
                <p className="text-sm text-gray-500 mb-5">
                  Please enter the 6-digits code we have sent to:{" "}
                  <span className="font-medium text-gray-700">{newEmail}.</span>{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline underline-offset-2"
                    onClick={() => {
                      setStep("request");
                      setError(null);
                    }}
                  >
                    Edit
                  </button>
                </p>
                <form
                  id="change-email-form"
                  onSubmit={(e) => codeForm.handleSubmit(onConfirmCode)(e)}
                  className="space-y-4"
                >
                  <div
                    className="flex justify-center gap-2"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onFocus={() => setFocusedOtpIndex(i)}
                        onBlur={() => setFocusedOtpIndex(null)}
                        className={`size-11 text-center text-lg font-semibold border rounded-none outline-none transition-colors ${
                          focusedOtpIndex === i
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {error && (
                    <p
                      role="alert"
                      className="text-sm text-destructive text-center"
                    >
                      {error}
                    </p>
                  )}
                  {countdown > 0 ? (
                    <p className="text-center text-sm text-gray-400">
                      You can request another code in: {countdown}s
                    </p>
                  ) : (
                    <p className="text-center text-sm">
                      <button
                        type="button"
                        className="text-blue-600 underline underline-offset-2"
                        onClick={() => requestForm.handleSubmit(onSendCode)()}
                      >
                        Resend code
                      </button>
                    </p>
                  )}
                </form>
              </>
            )}
          </div>

          {/* footer button */}
          <div className="px-0 pt-6 pb-0">
            {step === "request" && (
              <Button
                type="submit"
                form="change-email-form"
                disabled={isRequesting}
                className="w-full rounded-none bg-blue-600 text-white hover:bg-blue-700 h-12 text-base"
              >
                {isRequesting ? (
                  "Sending…"
                ) : (
                  <span className="flex items-center gap-1">
                    Next <span>&rsaquo;</span>
                  </span>
                )}
              </Button>
            )}
            {step === "confirm" && (
              <Button
                type="submit"
                form="change-email-form"
                disabled={isConfirming}
                className="w-full rounded-none bg-blue-600 text-white hover:bg-blue-700 h-12 text-base"
              >
                {isConfirming ? "Verifying…" : "Verify Code"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeEmailSection;
