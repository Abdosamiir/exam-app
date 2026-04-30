"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { useDeleteExam } from "../../hooks/use-exams";
import { IExam, IExamDetail } from "../../types/exam";

interface DeleteExamPanelProps {
  exam: IExam | IExamDetail;
}

const DeleteExamPanel = ({ exam }: DeleteExamPanelProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteExam();

  return (
    <div className="flex max-w-xl flex-col gap-4 border bg-white p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-950">Delete exam</h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete {exam.title}?
        </p>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            mutate(exam.id, {
              onSuccess: (res) => {
                if (!res.status) {
                  setFormError(res.message ?? "Failed to delete exam.");
                  return;
                }

                router.push("/admin/exams");
              },
              onError: () =>
                setFormError("Something went wrong. Please try again."),
            })
          }
        >
          {isPending ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admin/exams/${exam.id}`}>Cancel</Link>
        </Button>
      </div>
    </div>
  );
};

export default DeleteExamPanel;
