"use client";

import { useState } from "react";
import { useExams } from "../../hooks/use-exams";
import { IExam } from "../../types/exam";
import DeleteExamButton from "./delete-exam-button";
import EditExamForm from "./edit-exam-form";
import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useRouter } from "next/router";

const ExamsAdminTable = () => {
  const { data, isLoading, isError } = useExams();
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-destructive">
        Failed to load exams. Please try again.
      </p>
    );
  }

  const exams: IExam[] = data.payload?.data ?? [];
  // console.log(exams);
  // exam.id

  if (exams.length === 0) {
    return <p className="text-sm text-gray-500">No exams yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Diploma</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Questions</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {exams.map((exam) => (
            <>
              <tr key={exam.id} className="hover:bg-gray-50">
                {/* <Link href={`exams/${exam.id}/questions`}> */}
                <td
                  className="px-4 py-3 font-medium max-w-xs truncate"
                  onClick={() => router.push(`exams/${exam.id}/questions`)}
                >
                  {exam.title}
                </td>
                {/* </Link> */}
                <td className="px-4 py-3 text-gray-500">
                  {exam.diploma.title}
                </td>
                <td className="px-4 py-3 text-gray-500">{exam.duration} min</td>
                <td className="px-4 py-3 text-gray-500">
                  {exam.questionsCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() =>
                        setEditingId(editingId === exam.id ? null : exam.id)
                      }
                    >
                      {editingId === exam.id ? "Close" : "Edit"}
                    </button>
                    <DeleteExamButton id={exam.id} />
                  </div>
                </td>
              </tr>
              {editingId === exam.id && (
                <tr key={`edit-${exam.id}`}>
                  <td colSpan={5} className="bg-gray-50 px-4 py-4">
                    <EditExamForm
                      exam={exam}
                      onClose={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamsAdminTable;
