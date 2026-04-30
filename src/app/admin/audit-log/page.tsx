import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getAuditLogs } from "@/features/audit-logs/api/api.audit-logs";
import AuditLogsAdminTable from "@/features/audit-logs/components/admin/audit-logs-admin-table";
import AuditLogsPagination from "@/features/audit-logs/components/admin/audit-logs-pagination";
import AuditLogsSearchFilter from "@/features/audit-logs/components/admin/audit-logs-search-filter";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { Suspense } from "react";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["audit-logs", page, 20],
    queryFn: () => getAuditLogs(session?.accessToken, page, 20),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Suspense fallback={null}>
              <AuditLogsPagination />
            </Suspense>
          </div>
          <AuditLogsSearchFilter />
        </div>
        <Suspense>
          <AuditLogsAdminTable role={session?.user.role} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
