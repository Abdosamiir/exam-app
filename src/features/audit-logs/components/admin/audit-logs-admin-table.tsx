"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  useAuditLogs,
  useDeleteAllAuditLogs,
  useDeleteAuditLog,
} from "../../hooks/use-audit-logs";
import { IAuditLog } from "../../types/audit-log";

const ACTION_STYLES: Record<IAuditLog["action"], string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

function DeleteRowButton({ id }: { id: string }) {
  const [confirmed, setConfirmed] = useState(false);
  const { mutate, isPending } = useDeleteAuditLog();

  if (!confirmed) {
    return (
      <Button variant="destructive" size="sm" onClick={() => setConfirmed(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Sure?</span>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => mutate(id)}
      >
        {isPending ? "…" : "Yes"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => setConfirmed(false)}>
        No
      </Button>
    </div>
  );
}

function DeleteAllButton() {
  const [confirmed, setConfirmed] = useState(false);
  const { mutate, isPending } = useDeleteAllAuditLogs();

  if (!confirmed) {
    return (
      <Button variant="destructive" onClick={() => setConfirmed(true)}>
        Delete All
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Delete all logs?</span>
      <Button
        variant="destructive"
        disabled={isPending}
        onClick={() => mutate()}
      >
        {isPending ? "Deleting…" : "Yes, delete all"}
      </Button>
      <Button variant="outline" onClick={() => setConfirmed(false)}>
        Cancel
      </Button>
    </div>
  );
}

const AuditLogsAdminTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAuditLogs(page);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-destructive">
        Failed to load audit logs. Please try again.
      </p>
    );
  }

  const logs: IAuditLog[] = data.payload?.data ?? [];
  const meta = data.payload?.metadata;

  if (logs.length === 0) {
    return <p className="text-sm text-gray-500">No audit logs found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <DeleteAllButton />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Actor</th>
              <th className="px-4 py-3 whitespace-nowrap">Role</th>
              <th className="px-4 py-3 whitespace-nowrap">Action</th>
              <th className="px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-4 py-3 whitespace-nowrap">Entity</th>
              <th className="px-4 py-3 whitespace-nowrap">Path</th>
              <th className="px-4 py-3 whitespace-nowrap">IP</th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{log.actorUsername}</div>
                  <div className="text-xs text-gray-400">{log.actorEmail}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{log.actorRole}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{log.category}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-600">{log.entityType}</div>
                  <div className="text-xs text-gray-400 max-w-[120px] truncate">
                    {log.entityId}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">
                  <span className="font-mono text-xs">{log.httpMethod}</span>{" "}
                  <span className="text-xs">{log.path}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                  {log.ipAddress}
                </td>
                <td className="px-4 py-3">
                  <DeleteRowButton id={log.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {meta.page} of {meta.totalPages} — {meta.total} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsAdminTable;
