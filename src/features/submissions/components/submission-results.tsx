"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSubmission } from "../hooks/use-submissions";
import { ISubmissionAnalyticsItem } from "../types/submission";
import ResultsPieChart from "./results-pie-chart";
import { FullQuestionReview, SimpleQuestionReview } from "./question-review";
import {
  QUIZ_STORAGE_KEY,
  type StoredQuizState,
} from "@/features/exams/components/exam-quiz";
import { IQuestion } from "@/features/questions/types/question";
import { FolderSearch, RotateCcw } from "lucide-react";

interface SubmissionResultsProps {
  id: string;
}

const SubmissionResults = ({ id }: SubmissionResultsProps) => {
  const { data, isLoading, isError } = useSubmission(id);

  const submission = data?.status ? data.payload?.submission : null;
  const analytics: ISubmissionAnalyticsItem[] = data?.status
    ? (data.payload?.analytics ?? [])
    : [];

  const storedQuestions = useMemo<IQuestion[] | null>(() => {
    if (!submission?.examId) return null;
    try {
      const raw = sessionStorage.getItem(QUIZ_STORAGE_KEY(submission.examId));
      if (!raw) return null;
      const state = JSON.parse(raw) as StoredQuizState;
      return state.questions ?? null;
    } catch {
      return null;
    }
  }, [submission?.examId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:h-[calc(100vh-120px)] md:flex-row md:gap-6">
        <div className="h-52 w-full shrink-0 animate-pulse rounded-none bg-gray-100 md:h-auto md:w-64" />
        <div className="flex flex-1 flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-none bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.status || !submission) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-sm text-red-500">
          Failed to load results. Please try again.
        </p>
        <Link href="/answers" className="text-sm text-blue-600 hover:underline">
          ← Back to my submissions
        </Link>
      </div>
    );
  }

  const { correctAnswers, wrongAnswers, totalQuestions, examTitle, examId } =
    submission;

  return (
    <div className="flex min-h-0 flex-col gap-4 md:h-[calc(100vh-80px)]">
      {/* Top bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="min-w-0 truncate text-base font-semibold text-gray-700">
          {examTitle}
        </h1>
        <span className="text-sm text-gray-500">
          Question{" "}
          <span className="font-bold text-blue-600">{totalQuestions}</span> of{" "}
          {totalQuestions}
        </span>
      </div>

      {/* Progress bar — full because exam is done */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-full rounded-full bg-blue-500" />
      </div>

      {/* Main content */}
      <p className="text-lg font-bold text-blue-700 self-start">Results:</p>
      <div className="flex flex-col gap-4 md:min-h-0 md:flex-1 md:flex-row md:gap-6">
        {/* Left panel — stats */}
        <div className="flex w-full shrink-0 flex-col items-center justify-center gap-5 rounded-none border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:p-5 md:w-64 md:flex-col md:p-6">
          <ResultsPieChart correct={correctAnswers} total={totalQuestions} />

          <div className="flex w-full flex-col gap-2.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="h-3 w-3 rounded-sm bg-green-500 shrink-0" />
              Correct:
              <span className="ml-auto font-bold text-green-600">
                {correctAnswers}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="h-3 w-3 rounded-sm bg-red-500 shrink-0" />
              Incorrect:
              <span className="ml-auto font-bold text-red-500">
                {wrongAnswers}
              </span>
            </div>
          </div>
        </div>

        {/* Right panel — question review */}
        <div className="w-full rounded-none border border-dashed border-gray-300 bg-white p-4 md:min-h-0 md:flex-1 md:overflow-y-auto md:p-5">
          {analytics.length > 0 ? (
            storedQuestions && storedQuestions.length > 0 ? (
              <FullQuestionReview
                questions={storedQuestions}
                analytics={analytics}
              />
            ) : (
              <SimpleQuestionReview analytics={analytics} />
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400 text-center">
                No question review data available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/exams/${examId}`}
          className="flex w-full flex-1 items-center justify-center gap-2 rounded-none border border-gray-300 bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
        >
          <RotateCcw className="size-5" />
          Restart
        </Link>
        <Link
          href="/diplomas"
          className="flex w-full flex-1 items-center justify-center gap-2 rounded-none bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <FolderSearch className="size-5" />
          Explore
        </Link>
      </div>
    </div>
  );
};

export default SubmissionResults;
