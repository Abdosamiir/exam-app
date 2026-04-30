"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateExam } from "../../hooks/use-exams";
import { useDiplomas } from "@/features/diplomas/hooks/use-diplomas";
import { IExam, IUpdateExamFields } from "../../types/exam";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import ImageUploadField from "@/shared/components/ui/image-upload-field";

interface EditExamFormProps {
  exam: IExam;
  onClose: () => void;
}

const EditExamForm = ({ exam, onClose }: EditExamFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const { data: diplomasData } = useDiplomas();
  const diplomas = diplomasData?.status ? (diplomasData.payload?.data ?? []) : [];

  const form = useForm<IUpdateExamFields>({
    defaultValues: {
      title: exam.title,
      description: exam.description,
      image: exam.image ?? "",
      duration: exam.duration,
      diplomaId: exam.diplomaId,
    },
  });

  const { mutate, isPending } = useUpdateExam(exam.id);

  const onSubmit = (data: IUpdateExamFields) => {
    setFormError(null);
    mutate(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to update exam.");
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
        <FieldLabel htmlFor="edit-title">Title</FieldLabel>
        <Input id="edit-title" {...form.register("title")} />
        {form.formState.errors.title && (
          <FieldError errors={[form.formState.errors.title]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="edit-description">Description</FieldLabel>
        <Input id="edit-description" {...form.register("description")} />
        {form.formState.errors.description && (
          <FieldError errors={[form.formState.errors.description]} />
        )}
      </Field>

      <Field>
        <FieldLabel>Image</FieldLabel>
        <ImageUploadField
          value={form.watch("image") ?? ""}
          onChange={(url) => form.setValue("image", url)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="edit-duration">Duration (minutes)</FieldLabel>
        <Input
          id="edit-duration"
          type="number"
          min={1}
          {...form.register("duration", { valueAsNumber: true })}
        />
        {form.formState.errors.duration && (
          <FieldError errors={[form.formState.errors.duration]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="edit-diplomaId">Diploma</FieldLabel>
        <select
          id="edit-diplomaId"
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...form.register("diplomaId")}
        >
          <option value="">Select a diploma</option>
          {diplomas.map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>
      </Field>

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

export default EditExamForm;
