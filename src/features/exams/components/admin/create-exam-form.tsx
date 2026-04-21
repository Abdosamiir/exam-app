"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateExam } from "../../hooks/use-exams";
import { useDiplomas } from "@/features/diplomas/hooks/use-diplomas";
import { ICreateExamFields } from "../../types/exam";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

const CreateExamForm = () => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: diplomasData } = useDiplomas();
  const diplomas = diplomasData?.status ? (diplomasData.payload?.data ?? []) : [];

  const form = useForm<ICreateExamFields>({
    defaultValues: {
      title: "",
      description: "",
      image: "",
      duration: 30,
      diplomaId: "",
    },
  });

  const { mutate, isPending } = useCreateExam();

  const onSubmit = (data: ICreateExamFields) => {
    setFormError(null);
    mutate(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to create exam.");
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
      <Button
        className="bg-blue-600 text-white rounded-none"
        onClick={() => setOpen(true)}
      >
        + New Exam
      </Button>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg border bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold">New Exam</h2>

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          placeholder="Exam title"
          {...form.register("title", { required: "Title is required" })}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <FieldError errors={[form.formState.errors.title]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Input
          id="description"
          placeholder="Description"
          {...form.register("description", { required: "Description is required" })}
          aria-invalid={!!form.formState.errors.description}
        />
        {form.formState.errors.description && (
          <FieldError errors={[form.formState.errors.description]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="image">Image URL</FieldLabel>
        <Input id="image" placeholder="https://..." {...form.register("image")} />
      </Field>

      <Field>
        <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
        <Input
          id="duration"
          type="number"
          min={1}
          {...form.register("duration", {
            required: "Duration is required",
            valueAsNumber: true,
            min: { value: 1, message: "Must be at least 1 minute" },
          })}
          aria-invalid={!!form.formState.errors.duration}
        />
        {form.formState.errors.duration && (
          <FieldError errors={[form.formState.errors.duration]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="diplomaId">Diploma</FieldLabel>
        <select
          id="diplomaId"
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...form.register("diplomaId", { required: "Diploma is required" })}
        >
          <option value="">Select a diploma</option>
          {diplomas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>
        {form.formState.errors.diplomaId && (
          <FieldError errors={[form.formState.errors.diplomaId]} />
        )}
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-destructive">{formError}</p>
      )}

      <div className="flex gap-2">
        <Button disabled={isPending} className="bg-blue-600 text-white rounded-none">
          {isPending ? "Creating…" : "Create"}
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

export default CreateExamForm;
