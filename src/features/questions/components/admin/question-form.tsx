"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils/utils";
import { useCreateQuestion, useUpdateQuestion } from "../../hooks/use-questions";
import {
  IQuestion,
  ICreateQuestionFields,
  IUpdateQuestionFields,
} from "../../types/question";

interface QuestionFormProps {
  examId: string;
  question?: IQuestion;
  mode: "create" | "edit";
}

const QuestionForm = ({ examId, question, mode }: QuestionFormProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion(question?.id ?? "", examId);
  const isPending = createQuestion.isPending || updateQuestion.isPending;

  const form = useForm<ICreateQuestionFields>({
    defaultValues: {
      text: question?.text ?? "",
      examId,
      answers: question?.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })) ?? [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  const onSubmit = (data: ICreateQuestionFields) => {
    setFormError(null);

    if (mode === "create") {
      createQuestion.mutate(data, {
        onSuccess: (res) => {
          if (!res.status || !res.payload) {
            setFormError(res.message ?? "Failed to create question.");
            return;
          }
          router.push(`/admin/exams/${examId}/questions/${res.payload.id}`);
        },
        onError: () => setFormError("Something went wrong. Please try again."),
      });
      return;
    }

    const updateData: IUpdateQuestionFields = { text: data.text, answers: data.answers };
    updateQuestion.mutate(updateData, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to update question.");
          return;
        }
        router.push(`/admin/exams/${examId}/questions/${question!.id}`);
      },
      onError: () => setFormError("Something went wrong. Please try again."),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-full">
      <div className="overflow-hidden border border-border shadow-sm">
        <div className="bg-blue-600 px-6 py-3">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Question Information
          </h2>
        </div>

        <div className="bg-background p-6 flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="q-text">Question</FieldLabel>
            <textarea
              id="q-text"
              rows={3}
              placeholder="Enter question text..."
              className={cn(
                "border-input placeholder:text-muted-foreground w-full border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none resize-none",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                form.formState.errors.text && "border-destructive ring-destructive/20",
              )}
              {...form.register("text", { required: "Question text is required" })}
              aria-invalid={!!form.formState.errors.text}
            />
            {form.formState.errors.text && (
              <FieldError errors={[form.formState.errors.text]} />
            )}
          </Field>

          <div className="flex flex-col gap-2">
            <FieldLabel>Answers</FieldLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 w-4">
                  {String.fromCharCode(65 + index)}.
                </span>
                <Input
                  placeholder={`Answer ${String.fromCharCode(65 + index)}`}
                  {...form.register(`answers.${index}.text`, {
                    required: "Answer text is required",
                  })}
                />
                <label className="flex items-center gap-1 text-xs text-gray-600 shrink-0 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...form.register(`answers.${index}.isCorrect`)}
                    className="h-3.5 w-3.5 accent-blue-600"
                  />
                  Correct
                </label>
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-red-500 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ text: "", isCorrect: false })}
              className="self-start text-xs text-blue-600 hover:underline"
            >
              + Add answer
            </button>
          </div>

          {formError && (
            <p role="alert" className="text-sm text-destructive">{formError}</p>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-muted/30 px-6 py-4">
          <Button
            disabled={isPending}
            className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
          >
            {isPending
              ? mode === "create" ? "Creating..." : "Saving..."
              : mode === "create" ? "Create Question" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
