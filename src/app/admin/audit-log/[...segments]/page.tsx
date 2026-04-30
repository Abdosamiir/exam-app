import Link from "next/link";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { Button } from "@/shared/components/ui/button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { getAuditLogById } from "@/features/audit-logs/api/api.audit-logs";
import DeleteAuditLogPanel from "@/features/audit-logs/components/admin/delete-audit-log-panel";
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

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b pb-3">
      <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
      <div className="mt-1 break-words text-sm text-gray-700">{value}</div>
    </div>
  );
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
  const { queryClient, data } = await getRouteAuditLog(
    route.id,
    session?.accessToken,
  );
  const log = data?.status ? resolveAuditLog(data.payload) : null;

  if (!log) {
    return <p className="p-6 text-sm text-destructive">Audit log not found.</p>;
  }

  if (!hasPermission("view:audit-logs", role)) notFound();
  if (route.mode === "delete" && !hasPermission("delete:audit-logs", role)) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        {route.mode === "view" && (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{log.action} Audit Log</h1>
                <p className="text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
              {hasPermission("delete:audit-logs", role) && (
                <Button asChild variant="destructive" className="rounded-none">
                  <Link href={`/admin/audit-log/${log.id}/delete`}>Delete</Link>
                </Button>
              )}
            </div>

            <div className="grid max-w-5xl gap-6 md:grid-cols-2">
              <div className="space-y-4 border bg-white p-5">
                <h2 className="text-lg font-semibold">Actor</h2>
                <DetailItem label="Username" value={log.actorUsername} />
                <DetailItem label="Email" value={log.actorEmail} />
                <DetailItem label="Role" value={log.actorRole} />
                <DetailItem label="User ID" value={log.actorUserId} />
              </div>

              <div className="space-y-4 border bg-white p-5">
                <h2 className="text-lg font-semibold">Request</h2>
                <DetailItem label="Action" value={log.action} />
                <DetailItem label="Category" value={log.category} />
                <DetailItem
                  label="Path"
                  value={
                    <>
                      <span className="font-mono">{log.httpMethod}</span>{" "}
                      {log.path}
                    </>
                  }
                />
                <DetailItem label="IP Address" value={log.ipAddress} />
                <DetailItem label="User Agent" value={log.userAgent} />
              </div>

              <div className="space-y-4 border bg-white p-5 md:col-span-2">
                <h2 className="text-lg font-semibold">Entity</h2>
                <DetailItem label="Type" value={log.entityType} />
                <DetailItem label="ID" value={log.entityId} />
                <DetailItem
                  label="Metadata"
                  value={
                    <pre className="max-h-80 overflow-auto bg-gray-50 p-3 text-xs">
                      {JSON.stringify(log.metadata ?? {}, null, 2)}
                    </pre>
                  }
                />
              </div>
            </div>
          </>
        )}

        {route.mode === "delete" && <DeleteAuditLogPanel log={log} />}
      </div>
    </HydrationBoundary>
  );
}
