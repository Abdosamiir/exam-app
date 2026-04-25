import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getExamById } from "@/features/exams/api/api.exams";
import { getQuestionsByExam } from "@/features/questions/api/api.questions";
import ExamQuiz from "@/features/exams/components/exam-quiz";
import Link from "next/link";
import { IExamDetailPayload } from "@/features/exams/types/exam";

export default async function ExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["exams", "detail", id],
      queryFn: () => getExamById(id, session?.accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: ["questions", "exam", id],
      queryFn: () => getQuestionsByExam(id, session?.accessToken),
    }),
  ]);

  const examData = queryClient.getQueryData<IApiResponse<IExamDetailPayload>>(
    ["exams", "detail", id],
  );

  const exam = examData?.status ? examData.payload?.exam : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link
          href={exam?.diplomaId ? `/diplomas/${exam.diplomaId}` : "/diplomas"}
          className="self-start text-sm text-blue-600 hover:underline underline-offset-4"
        >
          ← Back to exams
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{exam?.title ?? "Exam"}</h1>
          {exam?.description && (
            <p className="text-sm text-gray-500">{exam.description}</p>
          )}
          {exam && (
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
              <span>{exam.questionsCount} questions</span>
              <span>{exam.duration} min</span>
            </div>
          )}
        </div>

        {exam ? (
          <ExamQuiz exam={exam} />
        ) : (
          <p className="text-sm text-red-500">Failed to load exam.</p>
        )}
      </div>
    </HydrationBoundary>
  );
}
