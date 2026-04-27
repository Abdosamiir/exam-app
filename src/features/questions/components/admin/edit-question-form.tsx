"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateQuestion } from "../../hooks/use-questions";
import { IQuestion, IUpdateQuestionFields } from "../../types/question";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface EditQuestionFormProps {
  question: IQuestion;
  onClose: () => void;
}

const EditQuestionForm = ({ question, onClose }: EditQuestionFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<IUpdateQuestionFields>({
    defaultValues: {
      text: question.text,
      answers: question.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  const { mutate, isPending } = useUpdateQuestion(question.id, question.examId);

  const onSubmit = (data: IUpdateQuestionFields) => {
    setFormError(null);
    mutate(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to update question.");
          return;
        }
        onClose();
      },
      onError: () => setFormError("Something went wrong. Please try again."),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="edit-q-text">Question</FieldLabel>
        <Input
          id="edit-q-text"
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

      <div className="flex gap-2">
        <Button disabled={isPending} className="bg-blue-600 text-white rounded-none">
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" className="rounded-none" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditQuestionForm;
