"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { TRole } from "@/features/auth/types/user";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useAuditLogs } from "../../hooks/use-audit-logs";
import { IAuditLog } from "../../types/audit-log";

const ACTION_STYLES: Record<IAuditLog["action"], string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
};

const LIMIT = 20;

const AuditLogRowMenu = ({ log, role }: { log: IAuditLog; role?: TRole }) => {
  const [open, setOpen] = useState(false);
  const canDelete = hasPermission("delete:audit-logs", role);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        className="bg-gray-200 p-1.5 text-gray-800 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setOpen((current) => !current)}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 rounded-md border bg-white py-1 shadow-lg">
          <Link
            href={`/admin/audit-log/${log.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} className="text-green-500" />
            View
          </Link>
          {canDelete && (
            <Link
              href={`/admin/audit-log/${log.id}/delete`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <Trash2 size={14} className="text-red-500" />
              Delete
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const AuditLogRow = ({ log, role }: { log: IAuditLog; role?: TRole }) => {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50">
      <div className="hidden w-40 shrink-0 text-xs text-gray-400 md:block">
        {new Date(log.createdAt).toLocaleString()}
      </div>

      <div className="min-w-0 max-w-[180px] flex-[1_1_180px] sm:max-w-[260px]">
        <p className="truncate text-sm font-medium text-gray-900">
          {log.actorUsername}
        </p>
        <p className="truncate text-xs text-gray-400">{log.actorEmail}</p>
      </div>

      <div className="hidden w-24 shrink-0 sm:block">
        <span
          className={`rounded px-2 py-0.5 text-xs font-semibold ${
            ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {log.action}
        </span>
      </div>

      <div className="hidden w-32 min-w-0 md:block">
        <p className="truncate text-sm text-gray-600">{log.category}</p>
      </div>

      <div className="hidden min-w-0 max-w-[180px] flex-[1_1_180px] lg:block">
        <p className="truncate text-sm text-gray-600">{log.entityType}</p>
        <p className="truncate text-xs text-gray-400">{log.entityId}</p>
      </div>

      <div className="hidden min-w-0 max-w-[220px] flex-[1_1_220px] xl:block">
        <p className="truncate text-xs text-gray-500">
          <span className="font-mono">{log.httpMethod}</span> {log.path}
        </p>
      </div>

      <div className="ml-auto">
        <AuditLogRowMenu log={log} role={role} />
      </div>
    </div>
  );
};

const AuditLogsAdminTable = ({ role }: { role?: TRole }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = (searchParams.get("search") ?? "").toLowerCase().trim();
  const action = searchParams.get("action");
  const { data, isLoading, isError } = useAuditLogs(page, LIMIT);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-100" />
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

  const logs: IAuditLog[] = (data.payload?.data ?? []).filter((log) => {
    const matchesSearch =
      !search ||
      log.actorUsername.toLowerCase().includes(search) ||
      log.actorEmail.toLowerCase().includes(search) ||
      log.category.toLowerCase().includes(search) ||
      log.entityType.toLowerCase().includes(search) ||
      log.entityId.toLowerCase().includes(search) ||
      log.path.toLowerCase().includes(search);
    const matchesAction =
      action === "CREATE" || action === "UPDATE" || action === "DELETE"
        ? log.action === action
        : true;

    return matchesSearch && matchesAction;
  });

  if (logs.length === 0) {
    return <p className="text-sm text-gray-500">No audit logs found.</p>;
  }

  return (
    <div className="overflow-hidden border bg-white">
      <div className="flex items-center gap-4 bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
        <div className="hidden w-40 shrink-0 md:block">Date</div>
        <div className="max-w-[180px] flex-[1_1_180px] sm:max-w-[260px]">
          Actor
        </div>
        <div className="hidden w-24 shrink-0 sm:block">Action</div>
        <div className="hidden w-32 md:block">Category</div>
        <div className="hidden max-w-[180px] flex-[1_1_180px] lg:block">
          Entity
        </div>
        <div className="hidden max-w-[220px] flex-[1_1_220px] xl:block">
          Path
        </div>
        <div className="ml-auto w-7" />
      </div>

      {logs.map((log) => (
        <AuditLogRow key={log.id} log={log} role={role} />
      ))}
    </div>
  );
};

export default AuditLogsAdminTable;
