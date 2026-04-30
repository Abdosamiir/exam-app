"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteExams } from "../hooks/use-exams";
import ExamCard from "./exam-card";
import { IExam } from "../types/exam";

interface ExamsListProps {
  diplomaId: string;
}

const SkeletonGrid = ({ count }: { count: number }) => (
  <div className="flex flex-col gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-52 animate-pulse rounded-lg bg-gray-100" />
    ))}
  </div>
);

const ExamsList = ({ diplomaId }: ExamsListProps) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteExams(diplomaId);

  if (isLoading) return <SkeletonGrid count={6} />;

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Failed to load exams. Please try again.
      </p>
    );
  }

  const exams: IExam[] = data.pages.flatMap((page) =>
    page.status ? (page.payload?.data ?? []) : [],
  );

  if (exams.length === 0) {
    return <p className="text-sm text-gray-500">No exams found for this diploma.</p>;
  }

  return (
    <InfiniteScroll
      dataLength={exams.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<SkeletonGrid count={3} />}
      endMessage={
        <p className="mt-6 text-center text-sm text-gray-500">
          <b>End of all exams</b>
        </p>
      }
    >
      <div className="flex flex-col gap-4">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default ExamsList;
