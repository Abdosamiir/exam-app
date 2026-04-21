import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getDiplomaById } from "@/features/diplomas/api/api.diplomas";
import DiplomaCard from "@/features/diplomas/components/diploma-card";

export default async function AdminDiplomaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["diplomas", id],
    queryFn: () => getDiplomaById(id, session?.accessToken),
  });

  const data = queryClient.getQueryData<IApiResponse<import("@/features/diplomas/types/diploma").IDiploma>>(
    ["diplomas", id]
  );

  if (!data?.status || !data.payload) {
    return <p className="text-sm text-destructive">Diploma not found.</p>;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6 max-w-lg">
        <h1 className="text-2xl font-bold">Diploma Detail</h1>
        <DiplomaCard diploma={data.payload} />
      </div>
    </HydrationBoundary>
  );
}
