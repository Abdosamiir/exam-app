"use client";

import { useState } from "react";
import { useDeleteExam } from "../../hooks/use-exams";
import { Button } from "@/shared/components/ui/button";

interface DeleteExamButtonProps {
  id: string;
}

const DeleteExamButton = ({ id }: DeleteExamButtonProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const { mutate, isPending } = useDeleteExam();

  if (!confirmed) {
    return (
      <Button variant="destructive" size="sm" onClick={() => setConfirmed(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Are you sure?</span>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => mutate(id)}
      >
        {isPending ? "Deleting…" : "Yes, delete"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => setConfirmed(false)}>
        Cancel
      </Button>
    </div>
  );
};

export default DeleteExamButton;
