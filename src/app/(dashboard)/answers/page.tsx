import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNextAuthToken } from "@/shared/lib/utils/auth.util";
import { getSubmissions } from "@/features/submissions/api/api.submissions";
import SubmissionsList from "@/features/submissions/components/submissions-list";

export default async function AnswersPage() {
  const jwt = await getNextAuthToken();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["submissions", undefined],
    queryFn: () => getSubmissions(undefined, jwt?.token),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">My Submissions</h1>
          <p className="text-sm text-gray-500">Your exam history and results</p>
        </div>

        <SubmissionsList />
      </div>
    </HydrationBoundary>
  );
}
