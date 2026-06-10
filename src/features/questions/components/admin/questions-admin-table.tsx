"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { useQuestions } from "../../hooks/use-questions";
import { IQuestion } from "../../types/question";

const QuestionRowMenu = ({ question }: { question: IQuestion }) => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const [open, setOpen] = useState(false);
  const canUpdate = hasPermission("update:exams", role);
  const canDelete = hasPermission("delete:exams", role);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        className="bg-gray-200 p-1.5 text-gray-800 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setOpen((current) => !current)}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 rounded-md border bg-white py-1 shadow-lg">
          <Link
            href={`/admin/exams/${question.examId}/questions/${question.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} className="text-green-500" />
            View
          </Link>
          {canUpdate && (
            <Link
              href={`/admin/exams/${question.examId}/questions/${question.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <Pencil size={14} className="text-primary" />
              Edit
            </Link>
          )}
          {canDelete && (
            <Link
              href={`/admin/exams/${question.examId}/questions/${question.id}/delete`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <Trash2 size={14} className="text-red-500" />
              Delete
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

interface QuestionsAdminTableProps {
  examId: string;
}

const QuestionsAdminTable = ({ examId }: QuestionsAdminTableProps) => {
  const { data, isLoading, isError } = useQuestions(examId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-destructive">
        Failed to load questions. Please try again.
      </p>
    );
  }

  const questions: IQuestion[] = data.payload?.questions ?? [];

  if (questions.length === 0) {
    return <p className="text-sm text-gray-500">No questions yet.</p>;
  }

  return (
    <div className="overflow-hidden border bg-white">
      <div className="flex items-center gap-4 bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
        <div className="flex-1">Title</div>
        <div className="w-7" />
      </div>

      {questions.map((question) => (
        <div
          key={question.id}
          className="flex items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
        >
          <p className="flex-1 truncate text-sm font-medium text-gray-900">
            {question.text}
          </p>
          <QuestionRowMenu question={question} />
        </div>
      ))}
    </div>
  );
};

export default QuestionsAdminTable;
