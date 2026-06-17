"use client";

import Link from "next/link";
import { useSubmissions } from "../hooks/use-submissions";
import { ISubmission } from "../types/submission";

const SubmissionRow = ({ submission }: { submission: ISubmission }) => {
  const score = submission.score ?? 0;
  const scoreColor =
    score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-500";

  return (
    <Link
      href={`/submissions/${submission.id}`}
      className="flex items-center justify-between rounded-lg border bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-gray-800">
          {submission.exam?.title ?? "Exam"}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(submission.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className={`text-lg font-bold ${scoreColor}`}>
          {Math.round(score)}%
        </div>
      </div>
    </Link>
  );
};

const SubmissionsList = () => {
  const { data, isLoading, isError } = useSubmissions();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-red-500">
        Failed to load submissions. Please try again.
      </p>
    );
  }

  const submissions: ISubmission[] = data.payload?.data ?? [];

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500 mb-3">
          You haven&apos;t taken any exams yet.
        </p>
        <Link
          href="/diplomas"
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Browse Diplomas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {submissions.map((submission) => (
        <SubmissionRow key={submission.id} submission={submission} />
      ))}
    </div>
  );
};

export default SubmissionsList;
