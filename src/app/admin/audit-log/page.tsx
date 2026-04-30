import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getAuditLogs } from "@/features/audit-logs/api/api.audit-logs";
import AuditLogsAdminTable from "@/features/audit-logs/components/admin/audit-logs-admin-table";

export default async function AdminAuditLogPage() {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["audit-logs", 1],
    queryFn: () => getAuditLogs(session?.accessToken, 1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <AuditLogsAdminTable />
      </div>
    </HydrationBoundary>
  );
}
