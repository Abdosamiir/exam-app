"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useBulkCreateQuestions } from "../../hooks/use-questions";
import { IBulkCreateQuestionsFields } from "../../types/question";
import { FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface BulkCreateQuestionsFormProps {
  examId: string;
}

const BulkCreateQuestionsForm = ({ examId }: BulkCreateQuestionsFormProps) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<IBulkCreateQuestionsFields>({
    defaultValues: {
      questions: [
        { text: "", answers: [{ text: "" }, { text: "" }] },
      ],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } =
    useFieldArray({ control: form.control, name: "questions" });

  const { mutate, isPending } = useBulkCreateQuestions(examId);

  const onSubmit = (data: IBulkCreateQuestionsFields) => {
    setFormError(null);
    mutate(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to create questions.");
          return;
        }
        form.reset();
        setOpen(false);
      },
      onError: () => setFormError("Something went wrong. Please try again."),
    });
  };

  if (!open) {
    return (
      <Button variant="outline" className="rounded-none" onClick={() => setOpen(true)}>
        + Bulk Add Questions
      </Button>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-lg border bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Bulk Add Questions</h2>

      {questionFields.map((qField, qIndex) => (
        <div key={qField.id} className="flex flex-col gap-3 rounded border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Question {qIndex + 1}
            </span>
            {questionFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove question
              </button>
            )}
          </div>

          <Input
            placeholder="Enter question text"
            {...form.register(`questions.${qIndex}.text`, {
              required: "Question text is required",
            })}
          />

          <div className="flex flex-col gap-2 pl-2">
            <FieldLabel>Answers</FieldLabel>
            <AnswerFields control={form.control} register={form.register} qIndex={qIndex} />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          appendQuestion({ text: "", answers: [{ text: "" }, { text: "" }] })
        }
        className="self-start text-sm text-blue-600 hover:underline"
      >
        + Add another question
      </button>

      {formError && (
        <p role="alert" className="text-sm text-destructive">{formError}</p>
      )}

      <div className="flex gap-2">
        <Button disabled={isPending} className="bg-blue-600 text-white rounded-none">
          {isPending ? "Creating…" : `Create ${questionFields.length} question${questionFields.length > 1 ? "s" : ""}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          onClick={() => { setOpen(false); form.reset(); }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

function AnswerFields({
  control,
  register,
  qIndex,
}: {
  control: import("react-hook-form").Control<IBulkCreateQuestionsFields>;
  register: import("react-hook-form").UseFormRegister<IBulkCreateQuestionsFields>;
  qIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qIndex}.answers`,
  });

  return (
    <>
      {fields.map((field, aIndex) => (
        <div key={field.id} className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 w-4">
            {String.fromCharCode(65 + aIndex)}.
          </span>
          <Input
            placeholder={`Answer ${String.fromCharCode(65 + aIndex)}`}
            {...register(`questions.${qIndex}.answers.${aIndex}.text`, {
              required: "Answer text is required",
            })}
          />
          {fields.length > 2 && (
            <button
              type="button"
              onClick={() => remove(aIndex)}
              className="text-xs text-red-500 hover:underline shrink-0"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ text: "" })}
        className="self-start text-xs text-blue-600 hover:underline"
      >
        + Add answer
      </button>
    </>
  );
}

export default BulkCreateQuestionsForm;
