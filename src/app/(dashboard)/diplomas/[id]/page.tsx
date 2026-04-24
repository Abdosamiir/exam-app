import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getDiplomaById } from "@/features/diplomas/api/api.diplomas";
import { getExams } from "@/features/exams/api/api.exams";
import ExamsList from "@/features/exams/components/exams-list";
import Link from "next/link";

export default async function DiplomaExamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["diplomas", id],
      queryFn: () => getDiplomaById(id, session?.accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: ["exams", id],
      queryFn: () => getExams({ diplomaId: id }, session?.accessToken),
    }),
  ]);

  const diplomaData = queryClient.getQueryData<
    IApiResponse<import("@/features/diplomas/types/diploma").IDiploma>
  >(["diplomas", id]);

  const diploma = diplomaData?.status ? diplomaData.payload : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Link
            href="/diplomas"
            className="text-sm text-blue-600 hover:underline underline-offset-4"
          >
            ← Diplomas
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{diploma?.title ?? "Exams"}</h1>
          {diploma?.description && (
            <p className="text-sm text-gray-500">{diploma.description}</p>
          )}
        </div>

        <ExamsList diplomaId={id} />
      </div>
    </HydrationBoundary>
  );
}
