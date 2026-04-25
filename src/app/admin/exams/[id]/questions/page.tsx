import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getExamById } from "@/features/exams/api/api.exams";
import { getQuestionsByExam } from "@/features/questions/api/api.questions";
import QuestionsAdminTable from "@/features/questions/components/admin/questions-admin-table";
import CreateQuestionForm from "@/features/questions/components/admin/create-question-form";
import BulkCreateQuestionsForm from "@/features/questions/components/admin/bulk-create-questions-form";
import Link from "next/link";

export default async function AdminExamQuestionsPage({
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

  const examTitle = examData?.status ? examData.payload?.exam.title : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/exams" className="hover:underline">
            Exams
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{examTitle ?? id}</span>
          <span>/</span>
          <span className="font-medium text-gray-800">Questions</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {examTitle ? `${examTitle} — Questions` : "Questions"}
          </h1>
          <div className="flex items-center gap-2">
            <BulkCreateQuestionsForm examId={id} />
            <CreateQuestionForm examId={id} />
          </div>
        </div>

        <QuestionsAdminTable examId={id} />
      </div>
    </HydrationBoundary>
  );
}
