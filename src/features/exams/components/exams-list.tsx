"use client";

import { useExams } from "../hooks/use-exams";
import ExamCard from "./exam-card";

interface ExamsListProps {
  diplomaId: string;
}

const ExamsList = ({ diplomaId }: ExamsListProps) => {
  const { data, isLoading, isError } = useExams(diplomaId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-lg bg-gray-100" />
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

  const exams = data.payload?.data ?? [];

  if (exams.length === 0) {
    return <p className="text-sm text-gray-500">No exams found for this diploma.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
};

export default ExamsList;
