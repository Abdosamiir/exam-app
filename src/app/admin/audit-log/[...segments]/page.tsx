import { notFound, redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { getAuditLogById } from "@/features/audit-logs/api/api.audit-logs";
import AuditLogDetailView from "@/features/audit-logs/components/admin/audit-log-detail-view";
import {
  IAuditLog,
  IAuditLogDetailPayload,
} from "@/features/audit-logs/types/audit-log";
import { hasPermission } from "@/shared/lib/utils/rbac.util";

type AuditLogRouteMode = "view" | "delete";

function resolveRoute(segments: string[]): { mode: AuditLogRouteMode; id: string } {
  if (segments.length === 1) {
    return { mode: "view", id: segments[0] };
  }
  if (segments.length === 2 && segments[1] === "delete") {
    return { mode: "delete", id: segments[0] };
  }
  notFound();
}

function resolveAuditLog(payload?: IAuditLogDetailPayload): IAuditLog | null {
  if (!payload) return null;
  if (payload.auditLog) return payload.auditLog;
  if (payload.log) return payload.log;
  if (payload.id && payload.action) return payload as IAuditLog;
  return null;
}

async function getRouteAuditLog(id: string, token?: string) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["audit-logs", id],
    queryFn: () => getAuditLogById(id, token),
  });

  const data = queryClient.getQueryData<IApiResponse<IAuditLogDetailPayload>>([
    "audit-logs",
    id,
  ]);

  return { queryClient, data };
}

export default async function AdminAuditLogCatchAllPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  const route = resolveRoute(segments);
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  // Redirect /delete route to the view — deletion is handled via modal
  if (route.mode === "delete") {
    redirect(`/admin/audit-log/${route.id}`);
  }

  if (!hasPermission("view:audit-logs", role)) notFound();

  const { queryClient, data } = await getRouteAuditLog(
    route.id,
    session?.accessToken,
  );
  const log = data?.status ? resolveAuditLog(data.payload) : null;

  if (!log) {
    return <p className="p-6 text-sm text-destructive">Audit log not found.</p>;
  }

  const canDelete = hasPermission("delete:audit-logs", role);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">{log.action} Audit Log</h1>
          <p className="text-sm text-gray-500">
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="max-w-full">
          <AuditLogDetailView log={log} canDelete={canDelete} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
