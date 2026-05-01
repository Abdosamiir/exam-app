import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PenLine, Trash2 } from "lucide-react";
import { authOptions } from "@/shared/lib/auth";
import { Button } from "@/shared/components/ui/button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { getQuestionById } from "@/features/questions/api/api.questions";
import QuestionForm from "@/features/questions/components/admin/question-form";
import DeleteQuestionPanel from "@/features/questions/components/admin/delete-question-panel";
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
        <div className="flex flex-col gap-6 p-6">
          <h1 className="text-2xl font-bold">Add Question</h1>
          <QuestionForm examId={examId} mode="create" />
        </div>
      </HydrationBoundary>
    );
  }

  if (!hasPermission("view:exams", role)) notFound();
  if (route.mode === "edit" && !hasPermission("update:exams", role)) notFound();
  if (route.mode === "delete" && !hasPermission("delete:exams", role)) notFound();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["questions", "detail", route.questionId!],
    queryFn: () => getQuestionById(route.questionId!, session?.accessToken),
  });

  const questionData = queryClient.getQueryData<IApiResponse<IQuestionDetailPayload>>([
    "questions",
    "detail",
    route.questionId!,
  ]);
  const question = questionData?.status ? (questionData.payload?.question ?? null) : null;

  if (!question) {
    return <p className="p-6 text-sm text-destructive">Question not found.</p>;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        {route.mode === "view" && (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold">Question</h1>
              <div className="flex flex-wrap gap-2">
                {hasPermission("update:exams", role) && (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                  >
                    <Link href={`/admin/exams/${examId}/questions/${question.id}/edit`}>
                      <PenLine /> Edit
                    </Link>
                  </Button>
                )}
                {hasPermission("delete:exams", role) && (
                  <Button asChild variant="destructive" className="rounded-none">
                    <Link href={`/admin/exams/${examId}/questions/${question.id}/delete`}>
                      <Trash2 /> Delete
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="max-w-2xl border bg-white p-5 flex flex-col gap-4">
              <p className="text-base font-medium text-gray-900">{question.text}</p>
              <div className="flex flex-col gap-2">
                {question.answers.map((answer, index) => (
                  <div key={answer.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 w-4">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span
                      className={`text-sm ${
                        answer.isCorrect
                          ? "font-medium text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {answer.text}
                    </span>
                    {answer.isCorrect && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {route.mode === "edit" && (
          <>
            <h1 className="text-2xl font-bold">Edit Question</h1>
            <QuestionForm examId={examId} question={question} mode="edit" />
          </>
        )}

        {route.mode === "delete" && <DeleteQuestionPanel question={question} />}
      </div>
    </HydrationBoundary>
  );
}
