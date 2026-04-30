"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateDiploma } from "../../hooks/use-diplomas";
import { ICreateDiplomaFields } from "../../types/diploma";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import ImageUploadField from "@/shared/components/ui/image-upload-field";
import { Plus } from "lucide-react";

const CreateDiplomaForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<ICreateDiplomaFields>({
    defaultValues: { title: "", description: "", image: "" },
  });

  const { mutate, isPending } = useCreateDiploma();

  const onSubmit = (data: ICreateDiplomaFields) => {
    setFormError(null);
    mutate(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to create diploma.");
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
        className="bg-emerald-500 text-white rounded-none"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        add new diploma
      </Button>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg border bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold">New Diploma</h2>

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          placeholder="Diploma title"
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
          value={form.watch("image") ?? ""}
          onChange={(url) => form.setValue("image", url)}
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
          {isPending ? "Creating…" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          onClick={() => {
            setOpen(false);
            form.reset();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateDiplomaForm;
