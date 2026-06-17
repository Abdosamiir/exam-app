import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNextAuthToken } from "@/shared/lib/utils/auth.util";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import DiplomasList from "@/features/diplomas/components/diplomas-list";

export default async function DiplomasPage() {
  const jwt = await getNextAuthToken();
  const queryClient = new QueryClient();

  if (jwt?.token) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["diplomas", "infinite"],
      queryFn: ({ pageParam }) =>
        getDiplomas({ page: pageParam as number, limit: 6 }, jwt.token),
      initialPageParam: 1,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <DiplomasList />
      </div>
    </HydrationBoundary>
  );
}
