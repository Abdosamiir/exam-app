"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestions } from "@/features/questions/hooks/use-questions";
import { useCreateSubmission } from "@/features/submissions/hooks/use-submissions";
import { IExamDetail } from "../types/exam";
import { IQuestion } from "@/features/questions/types/question";

interface ExamQuizProps {
  exam: IExamDetail;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export const QUIZ_STORAGE_KEY = (examId: string) => `quiz-state-${examId}`;

export interface StoredQuizState {
  questions: IQuestion[];
  selectedAnswers: Record<string, string>; // questionId -> answerId
}

const ExamQuiz = ({ exam }: ExamQuizProps) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuestions(exam.id);
  const { mutateAsync: submit, isPending } = useCreateSubmission();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitted = useRef(false);

  const questions: IQuestion[] = data?.status ? (data.payload?.questions ?? []) : [];
  const total = questions.length;
  const current = questions[currentIndex];
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const isLast = currentIndex === total - 1;

  const handleSubmit = async (answers: Record<string, string>) => {
    if (submitted.current) return;
    submitted.current = true;
    setSubmitError(null);

    // Persist quiz state so the results page can render the question review
    const state: StoredQuizState = { questions, selectedAnswers: answers };
    sessionStorage.setItem(QUIZ_STORAGE_KEY(exam.id), JSON.stringify(state));

    const payload = {
      examId: exam.id,
      answers: Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      })),
    };

    try {
      const res = await submit(payload);
      if (res.status && res.payload?.submission?.id) {
        router.push(`/submissions/${res.payload.submission.id}`);
      } else {
        submitted.current = false;
        setSubmitError("Submission failed. Please try again.");
      }
    } catch {
      submitted.current = false;
      setSubmitError("Submission failed. Please try again.");
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(selectedAnswers);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-red-500">
        Failed to load questions. Please try again.
      </p>
    );
  }

  if (total === 0) {
    return <p className="text-sm text-gray-500">No questions for this exam.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row: timer + question counter */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          Question {currentIndex + 1} of {total}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold tabular-nums ${
            timeLeft <= 60
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm flex flex-col gap-5">
        <p className="text-base font-semibold text-gray-900 leading-relaxed">
          {current.text}
        </p>

        <fieldset className="flex flex-col gap-3">
          {current.answers.map((answer, i) => {
            const label = String.fromCharCode(65 + i);
            const isSelected = selectedAnswers[current.id] === answer.id;
            return (
              <label
                key={answer.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-800 font-medium"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/40"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${current.id}`}
                  value={answer.id}
                  checked={isSelected}
                  onChange={() =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [current.id]: answer.id,
                    }))
                  }
                  className="accent-blue-600"
                />
                <span className="font-medium text-gray-400 mr-1">{label}.</span>
                {answer.text}
              </label>
            );
          })}
        </fieldset>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        {isLast ? (
          <button
            onClick={() => handleSubmit(selectedAnswers)}
            disabled={isPending || submitted.current}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting…" : "Submit Exam"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Next →
          </button>
        )}
      </div>

      {/* Answered summary */}
      <p className="text-center text-xs text-gray-400">
        {Object.keys(selectedAnswers).length} of {total} answered
      </p>
    </div>
  );
};

export default ExamQuiz;
