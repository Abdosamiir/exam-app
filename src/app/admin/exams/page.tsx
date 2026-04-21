import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getExams } from "@/features/exams/api/api.exams";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import ExamsAdminTable from "@/features/exams/components/admin/exams-admin-table";
import CreateExamForm from "@/features/exams/components/admin/create-exam-form";

export default async function AdminExamsPage() {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["exams", "all"],
      queryFn: () => getExams(undefined, session?.accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: ["diplomas"],
      queryFn: () => getDiplomas(session?.accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Exams</h1>
          <CreateExamForm />
        </div>
        <ExamsAdminTable />
      </div>
    </HydrationBoundary>
  );
}
