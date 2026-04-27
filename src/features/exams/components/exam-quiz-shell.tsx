"use client";

import { useCallback, useState } from "react";
import { IExamDetail } from "../types/exam";
import ExamQuiz from "./exam-quiz";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function CircularTimer({
  timeLeft,
  totalTime,
}: {
  timeLeft: number;
  totalTime: number;
}) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const pct = totalTime > 0 ? timeLeft / totalTime : 1;
  const offset = circ * (1 - pct);
  const urgent = timeLeft <= 60;

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg
        className="absolute inset-0 -rotate-90"
        width="48"
        height="48"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="7"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={urgent ? "#ef4444" : "#3b82f6"}
          strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="square"
          className="transition-all duration-1000"
        />
      </svg>
      <span
        className={`text-[10px] font-bold tabular-nums ${urgent ? "text-red-500" : "text-blue-600"}`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

const ExamQuizShell = ({ exam }: { exam: IExamDetail }) => {
  const totalTime = exam.duration * 60;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  const handleProgress = useCallback(
    (p: { currentIndex: number; total: number; timeLeft: number }) => {
      setCurrentIndex(p.currentIndex);
      setTotal(p.total);
      setTimeLeft(p.timeLeft);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          {exam.diploma.title && (
            <p className="text-sm text-gray-500 truncate">{exam.diploma.title} - {exam.title}</p>
          )}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-400">
              Question <span className="font-bold text-blue-600">{currentIndex + 1}</span> of {total}
            </span>
            <CircularTimer timeLeft={timeLeft} totalTime={totalTime} />
          </div>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-none bg-gray-50">
          <div
            className="h-full rounded-none bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ExamQuiz exam={exam} onProgress={handleProgress} />
    </div>
  );
};

export default ExamQuizShell;
