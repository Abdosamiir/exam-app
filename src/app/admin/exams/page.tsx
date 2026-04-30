import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getExams } from "@/features/exams/api/api.exams";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import ExamsAdminTable from "@/features/exams/components/admin/exams-admin-table";
import CreateExamForm from "@/features/exams/components/admin/create-exam-form";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import ExamsPagination from "@/features/exams/components/admin/exams-pagination";
import ExamsSearchFilter from "@/features/exams/components/admin/exams-search-filter";
import { Suspense } from "react";

export default async function AdminExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["exams", "all", page, 20],
      queryFn: () => getExams({ page, limit: 20 }, session?.accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: ["diplomas", 1, 20],
      queryFn: () => getDiplomas(session?.accessToken, 1, 20),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Suspense fallback={null}>
              <ExamsPagination />
            </Suspense>
            <CreateExamForm />
          </div>
          <ExamsSearchFilter />
        </div>
        <Suspense>
          <ExamsAdminTable role={session?.user.role} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
