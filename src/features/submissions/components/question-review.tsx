"use client";

import { IQuestion } from "@/features/questions/types/question";
import { ISubmissionAnalyticsItem } from "../types/submission";

// ─── Full review (used right after the exam, when sessionStorage has all options) ──

interface FullQuestionReviewProps {
  questions: IQuestion[];
  analytics: ISubmissionAnalyticsItem[];
}

export const FullQuestionReview = ({
  questions,
  analytics,
}: FullQuestionReviewProps) => {
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
                    className={`flex items-start gap-3 rounded-none px-3 py-2.5 text-sm sm:px-4 ${bg}`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${radioRing}`}
                    >
                      {(isSelected || isCorrect) && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className={`min-w-0 break-words ${textColor}`}>
                      {a.text}
                    </span>
                    {/* {isCorrect && !isSelected && (
                      <span className="ml-auto text-xs font-semibold text-green-600">
                        Correct answer
                      </span>
                    )} */}
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

// ─── Simple review (used for old submissions without cached quiz data) ─────────

interface SimpleQuestionReviewProps {
  analytics: ISubmissionAnalyticsItem[];
}

export const SimpleQuestionReview = ({
  analytics,
}: SimpleQuestionReviewProps) => (
  <div className="flex flex-col gap-5">
    {analytics.map((item, i) => (
      <div key={item.questionId} className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-blue-600">
          {i + 1}. {item.questionText}
        </p>
        <div className="flex flex-col gap-1.5">
          <div
            className={`flex flex-col items-start gap-2 rounded-none border px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3 sm:px-4 ${
              item.isCorrect
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
          >
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 sm:mt-0 ${
                  item.isCorrect
                    ? "border-green-500 bg-green-500"
                    : "border-red-500 bg-red-500"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span
                className={`min-w-0 break-words ${
                  item.isCorrect
                    ? "text-green-700 font-medium"
                    : "text-red-700"
                }`}
              >
                {item.selectedAnswer.text}
              </span>
            </div>
            <span className="text-xs text-gray-400 sm:ml-auto">
              Your answer
            </span>
          </div>

          {!item.isCorrect && (
            <div className="flex flex-col items-start gap-2 rounded-none border bg-green-50 border-green-300 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3 sm:px-4">
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-green-500 sm:mt-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="min-w-0 break-words text-green-700 font-medium">
                  {item.correctAnswer.text}
                </span>
              </div>
              <span className="text-xs font-semibold text-green-600 sm:ml-auto">
                Correct answer
              </span>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
