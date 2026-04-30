"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import ImageUploadField from "@/shared/components/ui/image-upload-field";
import {
  IDiploma,
  ICreateDiplomaFields,
  IUpdateDiplomaFields,
} from "../../types/diploma";
import { useCreateDiploma, useUpdateDiploma } from "../../hooks/use-diplomas";

type DiplomaFormValues = ICreateDiplomaFields & IUpdateDiplomaFields;

interface DiplomaFormProps {
  diploma?: IDiploma;
  mode: "create" | "edit";
}

const DiplomaForm = ({ diploma, mode }: DiplomaFormProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const createDiploma = useCreateDiploma();
  const updateDiploma = useUpdateDiploma(diploma?.id ?? "");
  const isPending = createDiploma.isPending || updateDiploma.isPending;

  const form = useForm<DiplomaFormValues>({
    defaultValues: {
      title: diploma?.title ?? "",
      description: diploma?.description ?? "",
      image: diploma?.image ?? "",
    },
  });
  const image = useWatch({ control: form.control, name: "image" });

  const onSubmit = (data: DiplomaFormValues) => {
    setFormError(null);

    if (mode === "create") {
      createDiploma.mutate(data, {
        onSuccess: (res) => {
          if (!res.status || !res.payload) {
            setFormError(res.message ?? "Failed to create diploma.");
            return;
          }

          router.push(`/admin/diplomas/${res.payload.id}`);
        },
        onError: () => setFormError("Something went wrong. Please try again."),
      });
      return;
    }

    updateDiploma.mutate(data, {
      onSuccess: (res) => {
        if (!res.status || !res.payload) {
          setFormError(res.message ?? "Failed to update diploma.");
          return;
        }

        router.push(`/admin/diplomas/${diploma!.id}`);
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
          value={image ?? ""}
          onChange={(url) =>
            form.setValue("image", url, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
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

export default DiplomaForm;
