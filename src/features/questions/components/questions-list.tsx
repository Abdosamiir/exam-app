"use client";

import { useState } from "react";
import { useQuestions } from "../hooks/use-questions";
import { IQuestion } from "../types/question";

interface QuestionsListProps {
  examId: string;
}

const QuestionItem = ({
  question,
  index,
}: {
  question: IQuestion;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-white p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-gray-800">{question.text}</p>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="self-start text-xs text-blue-600 hover:underline underline-offset-4"
      >
        {expanded ? "Hide answers" : `Show answers (${question.answers.length})`}
      </button>

      {expanded && (
        <ul className="flex flex-col gap-2 pl-9">
          {question.answers.map((answer, i) => (
            <li key={answer.id} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-0.5 font-medium text-gray-400">
                {String.fromCharCode(65 + i)}.
              </span>
              {answer.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const QuestionsList = ({ examId }: QuestionsListProps) => {
  const { data, isLoading, isError } = useQuestions(examId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
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
    return <p className="text-sm text-gray-500">No questions for this exam yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((question, index) => (
        <QuestionItem key={question.id} question={question} index={index} />
      ))}
    </div>
  );
};

export default QuestionsList;
