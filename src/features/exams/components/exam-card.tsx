import Link from "next/link";
import { IExam } from "../types/exam";

interface ExamCardProps {
  exam: IExam;
}

const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <Link
      href={`/dashboard/exams/${exam.id}`}
      className="group rounded-lg border bg-white p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      {exam.image && (
        <img
          src={exam.image}
          alt={exam.title}
          className="h-36 w-full rounded object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold group-hover:text-blue-600 transition-colors">
          {exam.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{exam.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{exam.questionsCount} questions</span>
        <span>{exam.duration} min</span>
      </div>
    </Link>
  );
};

export default ExamCard;
