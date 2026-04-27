import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getExamById } from "@/features/exams/api/api.exams";
import { getQuestionsByExam } from "@/features/questions/api/api.questions";
import ExamQuizShell from "@/features/exams/components/exam-quiz-shell";
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

  const examData = queryClient.getQueryData<IApiResponse<IExamDetailPayload>>([
    "exams",
    "detail",
    id,
  ]);

  const exam = examData?.status ? examData.payload?.exam : null;
  // console.log("Exam data:", exam);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6 max-w-full">
  
        {exam ? (
          <ExamQuizShell exam={exam} />
        ) : (
          <p className="text-sm text-red-500">Failed to load exam.</p>
        )}
      </div>
    </HydrationBoundary>
  );
}
