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
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        <div className="w-64 shrink-0 animate-pulse rounded-2xl bg-gray-100" />
        <div className="flex-1 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-gray-100"
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
    <div className="flex flex-col gap-4 h-[calc(100vh-80px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-700">{examTitle}</h1>
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
      <div className="flex gap-6 flex-1 min-h-0 md:flex-row flex-col ">
        {/* Left panel — stats */}
        <div className="w-64 shrink-0 rounded-none bg-blue-50 border border-blue-100 flex flex-col items-center justify-center gap-5 p-6">
          <ResultsPieChart correct={correctAnswers} total={totalQuestions} />

          <div className="flex flex-col gap-2.5 w-full">
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
        <div className="flex-1 min-h-0 rounded-none border border-dashed border-gray-300 bg-white p-5 overflow-y-auto">
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
      <div className="flex gap-3">
        <Link
          href={`/exams/${examId}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-none border border-gray-300 bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="size-5" />
          Restart
        </Link>
        <Link
          href="/diplomas"
          className="flex flex-1 items-center justify-center gap-2 rounded-none bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <FolderSearch className="size-5" />
          Explore
        </Link>
      </div>
    </div>
  );
};

export default SubmissionResults;
