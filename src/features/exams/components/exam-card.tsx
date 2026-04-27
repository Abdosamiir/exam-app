import Link from "next/link";
import { IExam } from "../types/exam";
import Image from "next/image";
import { ArrowRight, CircleQuestionMark, MoveRight, Timer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ExamCardProps {
  exam: IExam;
}

const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <Link
      href={`/exams/${exam.id}`}
      className="group border-2 flex-1 flex-col md:flex-row bg-blue-50 p-5 shadow-sm flex w-full gap-3 hover:border-dashed hover:border-2 hover:border-blue-200 hover:shadow-md transition-shadow"
    >
      {exam.image && (
        <Image
          src={exam.image}
          alt={exam.title}
          className="h-25 w-25 border border-blue-300 p-4 bg-blue-100   object-cover"
          width={100}
          height={200}
        />
      )}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-start flex-col md:flex-row gap-3 justify-between  ">
          <h3 className="text-base font-semibold text-blue-600 transition-colors">
            {exam.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-800">
            <span className="mr-2 flex items-center gap-1">
              <CircleQuestionMark className="inline-block size-4" />{" "}
              {exam.questionsCount} questions
            </span>
            |
            <span className="ml-2 flex items-center gap-1">
              <Timer className="inline-block size-4" /> {exam.duration} min
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-3">{exam.description}</p>
        <Button className="w-25 px-4 md:mt-5 self-end rounded-none uppercase flex items-center gap-2 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          start <MoveRight className="size-4" />
        </Button>
      </div>
    </Link>
  );
};

export default ExamCard;
