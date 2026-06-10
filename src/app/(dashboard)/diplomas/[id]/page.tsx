import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNextAuthToken } from "@/shared/lib/utils/auth.util";
import { getDiplomaById } from "@/features/diplomas/api/api.diplomas";
import { getExams } from "@/features/exams/api/api.exams";
import ExamsList from "@/features/exams/components/exams-list";

export default async function DiplomaExamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jwt = await getNextAuthToken();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["diplomas", id],
      queryFn: () => getDiplomaById(id, jwt?.token),
    }),
    queryClient.prefetchQuery({
      queryKey: ["exams", id],
      queryFn: () => getExams({ diplomaId: id }, jwt?.token),
    }),
  ]);

  const diplomaData = queryClient.getQueryData<
    IApiResponse<import("@/features/diplomas/types/diploma").IDiploma>
  >(["diplomas", id]);

  const diploma = diplomaData?.status ? diplomaData.payload : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
        
          {diploma?.description && (
            <p className="text-sm text-gray-500">{diploma.description}</p>
          )}
        </div>

        <ExamsList diplomaId={id} />
      </div>
    </HydrationBoundary>
  );
}
