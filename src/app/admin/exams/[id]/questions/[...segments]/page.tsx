import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, PenLine, Trash2 } from "lucide-react";
import { authOptions } from "@/shared/lib/auth";
import { Button } from "@/shared/components/ui/button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { getExamById } from "@/features/exams/api/api.exams";
import { IExamDetailPayload } from "@/features/exams/types/exam";
import { getQuestionById } from "@/features/questions/api/api.questions";
import QuestionForm from "@/features/questions/components/admin/question-form";
import DeleteQuestionPanel from "@/features/questions/components/admin/delete-question-panel";
import ToggleQuestionImmutableButton from "@/features/questions/components/admin/toggle-question-immutable-button";
import { IQuestionDetailPayload } from "@/features/questions/types/question";
import { hasPermission } from "@/shared/lib/utils/rbac.util";

type QuestionRouteMode = "create" | "view" | "edit" | "delete";

function resolveRoute(segments: string[]): {
  mode: QuestionRouteMode;
  questionId?: string;
} {
  if (segments.length === 1 && segments[0] === "add") {
    return { mode: "create" };
  }
  if (segments.length === 1) {
    return { mode: "view", questionId: segments[0] };
  }
  if (segments.length === 2 && segments[1] === "edit") {
    return { mode: "edit", questionId: segments[0] };
  }
  if (segments.length === 2 && segments[1] === "delete") {
    return { mode: "delete", questionId: segments[0] };
  }
  notFound();
}

export default async function AdminQuestionCatchAllPage({
  params,
}: {
  params: Promise<{ id: string; segments: string[] }>;
}) {
  const { id: examId, segments } = await params;
  const route = resolveRoute(segments);
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  if (route.mode === "create") {
    if (!hasPermission("create:exams", role)) notFound();

    return (
      <HydrationBoundary state={dehydrate(new QueryClient())}>
        <DashboardBreadcrumb />
        <div className="flex flex-col gap-4 p-6">
          <QuestionForm examId={examId} mode="create" />
        </div>
      </HydrationBoundary>
    );
  }

  if (!hasPermission("view:exams", role)) notFound();
  if (route.mode === "edit" && !hasPermission("update:exams", role)) notFound();
  if (route.mode === "delete" && !hasPermission("delete:exams", role)) notFound();

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["questions", "detail", route.questionId!],
      queryFn: () => getQuestionById(route.questionId!, session?.accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: ["exams", "detail", examId],
      queryFn: () => getExamById(examId, session?.accessToken),
    }),
  ]);

  const questionData = queryClient.getQueryData<IApiResponse<IQuestionDetailPayload>>([
    "questions",
    "detail",
    route.questionId!,
  ]);
  const question = questionData?.status ? (questionData.payload?.question ?? null) : null;

  if (!question) {
    return <p className="p-6 text-sm text-destructive">Question not found.</p>;
  }

  const examData = queryClient.getQueryData<IApiResponse<IExamDetailPayload>>([
    "exams",
    "detail",
    examId,
  ]);
  const exam = examData?.status ? (examData.payload?.exam ?? null) : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-4 p-6">
        {route.mode === "view" && (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{question.text}</h1>
                {exam && (
                  <p className="text-sm text-gray-400">
                    Exam:{" "}
                    <Link
                      href={`/admin/exams/${examId}`}
                      className="hover:underline inline-flex items-center gap-1"
                    >
                      {exam.title}
                      <ExternalLink size={12} />
                    </Link>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <ToggleQuestionImmutableButton
                  id={question.id}
                  examId={examId}
                  immutable={question.immutable}
                />
                {hasPermission("update:exams", role) && (
                  <Button
                    asChild
                    className="rounded-none bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Link href={`/admin/exams/${examId}/questions/${question.id}/edit`}>
                      <PenLine size={15} /> Edit
                    </Link>
                  </Button>
                )}
                {hasPermission("delete:exams", role) && (
                  <Button asChild variant="destructive" className="rounded-none">
                    <Link href={`/admin/exams/${examId}/questions/${question.id}/delete`}>
                      <Trash2 size={15} /> Delete
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className=" bg-white p-6 flex flex-col ">
              <div className="flex flex-col gap-1 pb-4">
                <span className="text-xs text-gray-400">Headline</span>
                <p className="text-sm text-gray-800">{question.text}</p>
              </div>

              <div className="flex flex-col gap-1 py-4">
                <span className="text-xs text-gray-400">Exam</span>
                {exam ? (
                  <Link
                    href={`/admin/exams/${examId}`}
                    className="text-sm text-gray-800 hover:underline inline-flex items-center gap-1"
                  >
                    {exam.title}
                    <ExternalLink size={12} />
                  </Link>
                ) : (
                  <p className="text-sm text-gray-800">{examId}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 pt-4">
                <span className="text-xs text-gray-400">Answers</span>
                <p className="text-sm text-gray-800">{question.answers.length}</p>
              </div>
            </div>
          </>
        )}

        {route.mode === "edit" && (
          <QuestionForm examId={examId} question={question} mode="edit" />
        )}

        {route.mode === "delete" && <DeleteQuestionPanel question={question} />}
      </div>
    </HydrationBoundary>
  );
}
