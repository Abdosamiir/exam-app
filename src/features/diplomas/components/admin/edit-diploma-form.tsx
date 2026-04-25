"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateDiploma } from "../../hooks/use-diplomas";
import { IDiploma, IUpdateDiplomaFields } from "../../types/diploma";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface EditDiplomaFormProps {
  diploma: IDiploma;
  onClose: () => void;
}

const EditDiplomaForm = ({ diploma, onClose }: EditDiplomaFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<IUpdateDiplomaFields>({
    defaultValues: {
      title: diploma.title,
      description: diploma.description,
      image: diploma.image ?? "",
    },
  });

  const { mutate, isPending } = useUpdateDiploma(diploma.id);

  const onSubmit = (data: IUpdateDiplomaFields) => {
    setFormError(null);
    mutate(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to update diploma.");
          return;
        }
        onClose();
      },
      onError: () => setFormError("Something went wrong. Please try again."),
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="edit-title">Title</FieldLabel>
        <Input
          id="edit-title"
          {...form.register("title")}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <FieldError errors={[form.formState.errors.title]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="edit-description">Description</FieldLabel>
        <Input
          id="edit-description"
          {...form.register("description")}
          aria-invalid={!!form.formState.errors.description}
        />
        {form.formState.errors.description && (
          <FieldError errors={[form.formState.errors.description]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="edit-image">Image</FieldLabel>
        <Input
          id="edit-image"
          placeholder="https://..."
          {...form.register("image")}
        />
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          disabled={isPending}
          className="bg-blue-600 text-white rounded-none"
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditDiplomaForm;
