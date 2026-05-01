"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { useDeleteQuestion } from "../../hooks/use-questions";
import { IQuestion } from "../../types/question";

interface DeleteQuestionPanelProps {
  question: IQuestion;
}

const DeleteQuestionPanel = ({ question }: DeleteQuestionPanelProps) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteQuestion(question.examId);

  return (
    <div className="flex max-w-xl flex-col gap-4 border bg-white p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-950">Delete question</h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this question?
        </p>
        <p className="text-sm font-medium text-gray-800">{question.text}</p>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">{formError}</p>
      )}

      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            mutate(question.id, {
              onSuccess: (res) => {
                if (!res.status) {
                  setFormError(res.message ?? "Failed to delete question.");
                  return;
                }
                router.push(`/admin/exams/${question.examId}`);
              },
              onError: () => setFormError("Something went wrong. Please try again."),
            })
          }
        >
          {isPending ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admin/exams/${question.examId}/questions/${question.id}`}>
            Cancel
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DeleteQuestionPanel;
