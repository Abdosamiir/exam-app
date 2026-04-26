import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import DiplomasList from "@/features/diplomas/components/diplomas-list";

export default async function DiplomasPage() {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["diplomas"],
    queryFn: () => getDiplomas(session?.accessToken),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        {/* <h1 className="text-2xl font-bold">Diplomas</h1> */}
        <DiplomasList />
      </div>
    </HydrationBoundary>
  );
}
