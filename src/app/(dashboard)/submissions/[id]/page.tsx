"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Label } from "recharts";
import { useSubmission } from "@/features/submissions/hooks/use-submissions";
import {
  ChartContainer,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import {
  QUIZ_STORAGE_KEY,
  type StoredQuizState,
} from "@/features/exams/components/exam-quiz";
import {
  ISubmissionAnalyticsItem,
} from "@/features/submissions/types/submission";
import { IQuestion } from "@/features/questions/types/question";

interface SubmissionResultsPageProps {
  params: Promise<{ id: string }>;
}

// ─── Pie chart ───────────────────────────────────────────────────────────────

const chartConfig: ChartConfig = {
  correct: { label: "Correct", color: "#22c55e" },
  incorrect: { label: "Incorrect", color: "#ef4444" },
};

const ResultsPieChart = ({
  correct,
  total,
}: {
  correct: number;
  total: number;
}) => {
  const wrong = total - correct;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const chartData = [
    { name: "correct", value: correct, fill: "#22c55e" },
    { name: "incorrect", value: wrong > 0 ? wrong : 0.001, fill: "#ef4444" },
  ];

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-45 w-45">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={82}
          paddingAngle={wrong > 0 ? 3 : 0}
          startAngle={90}
          endAngle={-270}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="none" />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) return null;
              const { cx, cy } = viewBox as { cx: number; cy: number };
              return (
                <text textAnchor="middle" dominantBaseline="middle">
                  <tspan
                    x={cx}
                    y={cy - 8}
                    style={{ fontSize: 24, fontWeight: 700, fill: "#111827" }}
                  >
                    {pct}%
                  </tspan>
                  <tspan
                    x={cx}
                    y={cy + 14}
                    style={{ fontSize: 11, fill: "#9ca3af" }}
                  >
                    Score
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

// ─── Question review ──────────────────────────────────────────────────────────

/**
 * Full review: shows all answer options (from stored quiz state) with
 * correct answer highlighted green and wrong selection highlighted red.
 */
const FullQuestionReview = ({
  questions,
  analytics,
}: {
  questions: IQuestion[];
  analytics: ISubmissionAnalyticsItem[];
}) => {
  // Build lookup maps from analytics
  const correctMap = Object.fromEntries(
    analytics.map((a) => [a.questionId, a.correctAnswer.id]),
  );
  const selectedMap = Object.fromEntries(
    analytics.map((a) => [a.questionId, a.selectedAnswer.id]),
  );

  return (
    <div className="flex flex-col gap-6">
      {questions.map((q, i) => {
        const selectedId = selectedMap[q.id];
        const correctId = correctMap[q.id];
        return (
          <div key={q.id} className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-blue-600">
              {i + 1}. {q.text}
            </p>
            <div className="flex flex-col gap-1.5">
              {q.answers.map((a) => {
                const isSelected = selectedId === a.id;
                const isCorrect = correctId === a.id;

                let bg = "bg-white border-gray-200";
                let textColor = "text-gray-700";
                let radioRing = "border-gray-300";

                if (isCorrect) {
                  bg = "bg-green-50 border-green-300";
                  textColor = "text-green-700 font-medium";
                  radioRing = "border-green-500 bg-green-500";
                } else if (isSelected) {
                  bg = "bg-red-50 border-red-300";
                  textColor = "text-red-700";
                  radioRing = "border-red-500 bg-red-500";
                }

                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm ${bg}`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${radioRing}`}
                    >
                      {(isSelected || isCorrect) && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className={textColor}>{a.text}</span>
                    {isCorrect && !isSelected && (
                      <span className="ml-auto text-xs font-semibold text-green-600">
                        Correct answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Simplified review: only uses analytics (no stored quiz state needed).
 * Shown when the user visits an old submission without cached quiz data.
 */
const SimpleQuestionReview = ({
  analytics,
}: {
  analytics: ISubmissionAnalyticsItem[];
}) => (
  <div className="flex flex-col gap-5">
    {analytics.map((item, i) => (
      <div key={item.questionId} className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-blue-600">
          {i + 1}. {item.questionText}
        </p>
        <div className="flex flex-col gap-1.5">
          {/* User's answer */}
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm ${
              item.isCorrect
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                item.isCorrect
                  ? "border-green-500 bg-green-500"
                  : "border-red-500 bg-red-500"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span
              className={
                item.isCorrect ? "text-green-700 font-medium" : "text-red-700"
              }
            >
              {item.selectedAnswer.text}
            </span>
            <span className="ml-auto text-xs text-gray-400">Your answer</span>
          </div>

          {/* Correct answer — only show separately when user was wrong */}
          {!item.isCorrect && (
            <div className="flex items-center gap-3 rounded-lg border bg-green-50 border-green-300 px-4 py-2.5 text-sm">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-green-500">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-green-700 font-medium">
                {item.correctAnswer.text}
              </span>
              <span className="ml-auto text-xs font-semibold text-green-600">
                Correct answer
              </span>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmissionResultsPage({
  params,
}: SubmissionResultsPageProps) {
  const { id } = use(params);
  const { data, isLoading, isError } = useSubmission(id);

  const submission = data?.status ? data.payload?.submission : null;
  const analytics: ISubmissionAnalyticsItem[] =
    data?.status ? (data.payload?.analytics ?? []) : [];

  // Read cached quiz questions from sessionStorage (available right after exam)
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

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        <div className="w-64 shrink-0 animate-pulse rounded-2xl bg-gray-100" />
        <div className="flex-1 flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
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
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left panel — stats */}
        <div className="w-64 shrink-0 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center gap-5 p-6">
          <p className="text-lg font-bold text-blue-700 self-start">Results:</p>

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
        <div className="flex-1 min-h-0 rounded-2xl border border-dashed border-gray-300 bg-white p-5 overflow-y-auto">
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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Restart
        </Link>
        <Link
          href="/diplomas"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Explore
        </Link>
      </div>
    </div>
  );
}
