"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useDiplomas } from "@/features/diplomas/hooks/use-diplomas";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import ImageUploadField from "@/shared/components/ui/image-upload-field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils/utils";
import { useCreateExam, useUpdateExam } from "../../hooks/use-exams";
import {
  ICreateExamFields,
  IExam,
  IExamDetail,
  IUpdateExamFields,
} from "../../types/exam";
import { Save, X } from "lucide-react";

type ExamFormValues = ICreateExamFields & IUpdateExamFields;

interface ExamFormProps {
  exam?: IExam | IExamDetail;
  mode: "create" | "edit";
}

const ExamForm = ({ exam, mode }: ExamFormProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { data: diplomasData } = useDiplomas();
  const diplomas = diplomasData?.status
    ? (diplomasData.payload?.data ?? [])
    : [];
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-full">
      <h1 className="text-2xl font-bold flex items-center justify-between gap-3 pb-4">
        Edit {exam?.title}{" "}
        <div className="flex items-center flex-row-reverse gap-3  bg-muted/30 ">
          <Button
            disabled={isPending}
            className="rounded-none bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Save size={14} />
            {isPending
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Exam"
                : "Save "}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none bg-gray-200"
            onClick={() => router.back()}
          >
            <X size={14} />
            Cancel
          </Button>
        </div>
      </h1>
      <div className="overflow-hidden border border-border shadow-sm">
        <div className="bg-primary px-6 py-3">
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Exam Information
          </h2>
        </div>

        <div className="bg-background p-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
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
              <FieldLabel htmlFor="diplomaId">Diploma</FieldLabel>
              <Controller
                control={form.control}
                name="diplomaId"
                rules={{ required: "Diploma is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="diplomaId"
                      className={cn(
                        "w-full",
                        form.formState.errors.diplomaId &&
                          "aria-invalid:border-destructive",
                      )}
                      aria-invalid={!!form.formState.errors.diplomaId}
                    >
                      <SelectValue placeholder="Select a diploma" />
                    </SelectTrigger>
                    <SelectContent>
                      {diplomas.map((diploma) => (
                        <SelectItem key={diploma.id} value={diploma.id}>
                          {diploma.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.diplomaId && (
                <FieldError errors={[form.formState.errors.diplomaId]} />
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
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter exam description..."
                className={cn(
                  "border-input placeholder:text-muted-foreground w-full border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none resize-none",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                  form.formState.errors.description &&
                    "border-destructive ring-destructive/20",
                )}
                {...form.register("description", {
                  required: "Description is required",
                })}
                aria-invalid={!!form.formState.errors.description}
              />
              {form.formState.errors.description && (
                <FieldError errors={[form.formState.errors.description]} />
              )}
            </Field>

            <Field className="md:col-span-2 md:max-w-xs">
              <FieldLabel htmlFor="duration">Duration (min)</FieldLabel>
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
          </div>

          {formError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {formError}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ExamForm;
