"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { useDiplomas } from "@/features/diplomas/hooks/use-diplomas";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import ImageUploadField from "@/shared/components/ui/image-upload-field";
import { Input } from "@/shared/components/ui/input";
import { useCreateExam, useUpdateExam } from "../../hooks/use-exams";
import {
  ICreateExamFields,
  IExam,
  IExamDetail,
  IUpdateExamFields,
} from "../../types/exam";

type ExamFormValues = ICreateExamFields & IUpdateExamFields;

interface ExamFormProps {
  exam?: IExam | IExamDetail;
  mode: "create" | "edit";
}

const ExamForm = ({ exam, mode }: ExamFormProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { data: diplomasData } = useDiplomas();
  const diplomas = diplomasData?.status ? (diplomasData.payload?.data ?? []) : [];
  const createExam = useCreateExam();
  const updateExam = useUpdateExam(exam?.id ?? "");
  const isPending = createExam.isPending || updateExam.isPending;

  const form = useForm<ExamFormValues>({
    defaultValues: {
      title: exam?.title ?? "",
      description: exam?.description ?? "",
      image: exam?.image ?? "",
      duration: exam?.duration ?? 30,
      diplomaId: exam?.diplomaId ?? "",
    },
  });
  const image = useWatch({ control: form.control, name: "image" });

  const onSubmit = (data: ExamFormValues) => {
    setFormError(null);

    if (mode === "create") {
      createExam.mutate(data, {
        onSuccess: (res) => {
          if (!res.status || !res.payload) {
            setFormError(res.message ?? "Failed to create exam.");
            return;
          }

          router.push(`/admin/exams/${res.payload.id}`);
        },
        onError: () => setFormError("Something went wrong. Please try again."),
      });
      return;
    }

    updateExam.mutate(data, {
      onSuccess: (res) => {
        if (!res.status || !res.payload) {
          setFormError(res.message ?? "Failed to update exam.");
          return;
        }

        router.push(`/admin/exams/${exam!.id}`);
      },
      onError: () => setFormError("Something went wrong. Please try again."),
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
    >
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
          {...form.register("description", {
            required: "Description is required",
          })}
          aria-invalid={!!form.formState.errors.description}
        />
        {form.formState.errors.description && (
          <FieldError errors={[form.formState.errors.description]} />
        )}
      </Field>

      <Field>
        <FieldLabel>Image</FieldLabel>
        <ImageUploadField
          value={image ?? ""}
          onChange={(url) =>
            form.setValue("image", url, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
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
          {diplomas.map((diploma) => (
            <option key={diploma.id} value={diploma.id}>
              {diploma.title}
            </option>
          ))}
        </select>
        {form.formState.errors.diplomaId && (
          <FieldError errors={[form.formState.errors.diplomaId]} />
        )}
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          disabled={isPending}
          className="rounded-none bg-blue-600 text-white"
        >
          {isPending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create"
              : "Save changes"}
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
    </form>
  );
};

export default ExamForm;
