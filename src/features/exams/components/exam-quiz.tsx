"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestions } from "@/features/questions/hooks/use-questions";
import { useCreateSubmission } from "@/features/submissions/hooks/use-submissions";
import { IExamDetail } from "../types/exam";
import { IQuestion } from "@/features/questions/types/question";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizProgress {
  currentIndex: number;
  total: number;
  timeLeft: number;
}

interface ExamQuizProps {
  exam: IExamDetail;
  onProgress?: (p: QuizProgress) => void;
}

export const QUIZ_STORAGE_KEY = (examId: string) => `quiz-state-${examId}`;

export interface StoredQuizState {
  questions: IQuestion[];
  selectedAnswers: Record<string, string>; // questionId -> answerId
}

const ExamQuiz = ({ exam, onProgress }: ExamQuizProps) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuestions(exam.id);
  const { mutateAsync: submit, isPending } = useCreateSubmission();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitted = useRef(false);

  const questions: IQuestion[] = data?.status
    ? (data.payload?.questions ?? [])
    : [];
  const total = questions.length;
  const current = questions[currentIndex];

  const isLast = currentIndex === total - 1;

  useEffect(() => {
    onProgress?.({ currentIndex, total, timeLeft });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, total, timeLeft]);

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
      {/* Question card */}
      <div className=" flex flex-col gap-5">
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
                className={`flex cursor-pointer items-center gap-3 bg-gray-100 px-4 py-3 text-sm transition-colors ${
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

                {answer.text}
              </label>
            );
          })}
        </fieldset>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      {/* Navigation */}
      <div className="flex items-center gap-2 justify-between w-full">
        <Button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="w-1/2 border rounded-none border-gray-300 px-5 py-5 text-sm font-medium text-gray-800 bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft /> Previous
        </Button>

        {isLast ? (
          <Button
            onClick={() => handleSubmit(selectedAnswers)}
            disabled={isPending || submitted.current}
            className="w-1/2 rounded-none bg-green-600 px-5 py-5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting…" : "Submit Exam"}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
            className="rounded-none w-1/2 bg-blue-600 px-5 py-5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Next <ChevronRight />
          </Button>
        )}
      </div>

  
    </div>
  );
};

export default ExamQuiz;
