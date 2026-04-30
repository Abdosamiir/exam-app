import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { Button } from "@/shared/components/ui/button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import { getExamById } from "@/features/exams/api/api.exams";
import DeleteExamPanel from "@/features/exams/components/admin/delete-exam-panel";
import ExamForm from "@/features/exams/components/admin/exam-form";
import ToggleExamImmutableButton from "@/features/exams/components/admin/toggle-exam-immutable-button";
import { IExamDetail, IExamDetailPayload } from "@/features/exams/types/exam";
import { hasPermission } from "@/shared/lib/utils/rbac.util";

type ExamRouteMode = "create" | "view" | "edit" | "delete";

function resolveRoute(segments: string[]): { mode: ExamRouteMode; id?: string } {
  if (segments.length === 1 && segments[0] === "add") {
    return { mode: "create" };
  }

  if (segments.length === 1) {
    return { mode: "view", id: segments[0] };
  }

  if (segments.length === 2 && segments[1] === "edit") {
    return { mode: "edit", id: segments[0] };
  }

  if (segments.length === 2 && segments[1] === "delete") {
    return { mode: "delete", id: segments[0] };
  }

  notFound();
}

async function getRouteExam(id: string, token?: string) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["exams", "detail", id],
      queryFn: () => getExamById(id, token),
    }),
    queryClient.prefetchQuery({
      queryKey: ["diplomas", 1, 20],
      queryFn: () => getDiplomas(token, 1, 20),
    }),
  ]);

  const data = queryClient.getQueryData<IApiResponse<IExamDetailPayload>>([
    "exams",
    "detail",
    id,
  ]);

  return { queryClient, data };
}

function resolveExam(payload?: IExamDetailPayload): IExamDetail | null {
  return payload?.exam ?? null;
}

export default async function AdminExamCatchAllPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  const route = resolveRoute(segments);
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  if (route.mode === "create") {
    if (!hasPermission("create:exams", role)) notFound();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
      queryKey: ["diplomas", 1, 20],
      queryFn: () => getDiplomas(session?.accessToken, 1, 20),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardBreadcrumb />
        <div className="flex flex-col gap-6 p-6">
          <h1 className="text-2xl font-bold">Add exam</h1>
          <ExamForm mode="create" />
        </div>
      </HydrationBoundary>
    );
  }

  const { queryClient, data } = await getRouteExam(
    route.id!,
    session?.accessToken,
  );
  const exam = data?.status ? resolveExam(data.payload) : null;

  if (!exam) {
    return <p className="p-6 text-sm text-destructive">Exam not found.</p>;
  }

  if (!hasPermission("view:exams", role)) notFound();
  if (route.mode === "edit" && !hasPermission("update:exams", role)) notFound();
  if (route.mode === "delete" && !hasPermission("delete:exams", role)) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        {route.mode === "view" && (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold">{exam.title}</h1>
              <div className="flex flex-wrap gap-2">
                <ToggleExamImmutableButton
                  id={exam.id}
                  immutable={exam.immutable}
                />
                <Button asChild variant="outline" className="rounded-none">
                  <Link href={`/admin/exams/${exam.id}/questions`}>
                    Questions
                  </Link>
                </Button>
                {hasPermission("update:exams", role) && (
                  <Button asChild variant="outline" className="rounded-none">
                    <Link href={`/admin/exams/${exam.id}/edit`}>Edit</Link>
                  </Button>
                )}
                {hasPermission("delete:exams", role) && (
                  <Button asChild variant="destructive" className="rounded-none">
                    <Link href={`/admin/exams/${exam.id}/delete`}>Delete</Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="grid max-w-5xl gap-6 md:grid-cols-[320px_1fr]">
              <div className="aspect-square overflow-hidden border bg-gray-50">
                {exam.image ? (
                  <Image
                    src={exam.image}
                    alt={exam.title}
                    width={640}
                    height={640}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-blue-50 via-white to-blue-100" />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">{exam.title}</h2>
                <p className="text-sm leading-6 text-gray-600">
                  {exam.description}
                </p>
                <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-gray-900">Diploma:</span>{" "}
                    {exam.diploma.title}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Duration:</span>{" "}
                    {exam.duration} min
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">
                      Questions:
                    </span>{" "}
                    {exam.questionsCount}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {route.mode === "edit" && (
          <>
            <h1 className="text-2xl font-bold">Edit {exam.title}</h1>
            <ExamForm exam={exam} mode="edit" />
          </>
        )}

        {route.mode === "delete" && <DeleteExamPanel exam={exam} />}
      </div>
    </HydrationBoundary>
  );
}
