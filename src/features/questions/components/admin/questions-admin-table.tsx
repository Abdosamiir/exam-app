"use client";

import { Fragment, useState } from "react";
import { useQuestions } from "../../hooks/use-questions";
import { IQuestion } from "../../types/question";
import DeleteQuestionButton from "./delete-question-button";
import EditQuestionForm from "./edit-question-form";
import ToggleQuestionImmutableButton from "./toggle-question-immutable-button";

interface QuestionsAdminTableProps {
  examId: string;
}

const QuestionsAdminTable = ({ examId }: QuestionsAdminTableProps) => {
  const { data, isLoading, isError } = useQuestions(examId);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Question</th>
            <th className="px-4 py-3">Answers</th>
            <th className="px-4 py-3">Immutable</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {questions.map((question, index) => (
            <Fragment key={question.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                <td className="px-4 py-3 font-medium max-w-sm truncate">
                  {question.text}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {question.answers.length}
                </td>
                <td className="px-4 py-3">
                  <ToggleQuestionImmutableButton
                    id={question.id}
                    examId={examId}
                    immutable={question.immutable}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() =>
                        setEditingId(
                          editingId === question.id ? null : question.id,
                        )
                      }
                    >
                      {editingId === question.id ? "Close" : "Edit"}
                    </button>
                    <DeleteQuestionButton id={question.id} examId={examId} />
                  </div>
                </td>
              </tr>
              {editingId === question.id && (
                <tr key={`edit-${question.id}`}>
                  <td colSpan={5} className="bg-gray-50 px-4 py-4">
                    <EditQuestionForm
                      question={question}
                      onClose={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsAdminTable;
