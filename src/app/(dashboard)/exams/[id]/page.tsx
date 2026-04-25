import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getExamById } from "@/features/exams/api/api.exams";
import { getQuestionsByExam } from "@/features/questions/api/api.questions";
import QuestionsList from "@/features/questions/components/questions-list";
import Link from "next/link";

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

  const examData = queryClient.getQueryData<
    IApiResponse<import("@/features/exams/types/exam").IExamDetailPayload>
  >(["exams", "detail", id]);

  const exam = examData?.status ? examData.payload?.exam : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <Link
          href={exam?.diplomaId ? `/diplomas/${exam.diplomaId}` : "/diplomas"}
          className="self-start text-sm text-blue-600 hover:underline underline-offset-4"
        >
          ← Back to exams
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{exam?.title ?? "Questions"}</h1>
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

        <QuestionsList examId={id} />
      </div>
    </HydrationBoundary>
  );
}
