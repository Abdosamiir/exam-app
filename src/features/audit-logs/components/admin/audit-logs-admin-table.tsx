"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { TRole } from "@/features/auth/types/user";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useAuditLogs } from "../../hooks/use-audit-logs";
import { IAuditLog } from "../../types/audit-log";

// ─── Style maps ───────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<IAuditLog["action"], string> = {
  CREATE: " text-green-700",
  UPDATE: "text-yellow-700",
  DELETE: "text-red-700",
};



const ROLE_STYLES: Record<string, string> = {
  ADMIN: " text-purple-700",
  MANAGER: "text-blue-700",
  USER: " text-gray-700",
};

// Maps entityType (case-insensitive) → admin route prefix
const ENTITY_ROUTES: Record<string, string> = {
  diploma: "/admin/diplomas",
  exam: "/admin/exams",
  question: "/admin/questions",
  user: "/admin/users",
};

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortKey =
  | "action_asc"
  | "action_desc"
  | "user_asc"
  | "user_desc"
  | "entity_asc"
  | "entity_desc"
  | "newest"
  | "oldest";

const SORT_OPTIONS: { label: string; value: SortKey; icon: React.ReactNode }[] =
  [
    {
      label: "Action (ascending)",
      value: "action_asc",
      icon: <ArrowUpAZ size={14} />,
    },
    {
      label: "Action (descending)",
      value: "action_desc",
      icon: <ArrowDownAZ size={14} />,
    },
    {
      label: "User (ascending)",
      value: "user_asc",
      icon: <ArrowUpAZ size={14} />,
    },
    {
      label: "User (descending)",
      value: "user_desc",
      icon: <ArrowDownAZ size={14} />,
    },
    {
      label: "Entity (ascending)",
      value: "entity_asc",
      icon: <ArrowUpAZ size={14} />,
    },
    {
      label: "Entity (descending)",
      value: "entity_desc",
      icon: <ArrowDownAZ size={14} />,
    },
    {
      label: "Newest (descending)",
      value: "newest",
      icon: <CalendarArrowDown size={14} />,
    },
    {
      label: "Newest (ascending)",
      value: "oldest",
      icon: <CalendarArrowUp size={14} />,
    },
  ];

function sortLogs(logs: IAuditLog[], sort: SortKey): IAuditLog[] {
  return [...logs].sort((a, b) => {
    switch (sort) {
      case "action_asc":
        return a.action.localeCompare(b.action);
      case "action_desc":
        return b.action.localeCompare(a.action);
      case "user_asc":
        return a.actorUsername.localeCompare(b.actorUsername);
      case "user_desc":
        return b.actorUsername.localeCompare(a.actorUsername);
      case "entity_asc":
        return a.entityType.localeCompare(b.entityType);
      case "entity_desc":
        return b.entityType.localeCompare(a.entityType);
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────

const SortDropdown = ({
  sort,
  onSort,
}: {
  sort: SortKey;
  onSort: (value: SortKey) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.value === sort);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="absolute   right-2" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 roundedpx-2.5 py-1 text-xs font-medium text-white "
      >
        Sort
        <ArrowDownWideNarrow
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 w-52 rounded-md border bg-white py-1 shadow-lg">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSort(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                sort === option.value
                  ? "font-semibold text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <span className="text-gray-400">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Row menu ─────────────────────────────────────────────────────────────────

const AuditLogRowMenu = ({ log, role }: { log: IAuditLog; role?: TRole }) => {
  const [open, setOpen] = useState(false);
  const canDelete = hasPermission("delete:audit-logs", role);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        className="bg-gray-200 p-1.5 text-gray-800 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal size={16} />
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

// ─── Row ──────────────────────────────────────────────────────────────────────

const AuditLogRow = ({ log, role }: { log: IAuditLog; role?: TRole }) => {
  const date = new Date(log.createdAt);
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const entityKey = log.entityType?.toLowerCase();
  const entityRoute = ENTITY_ROUTES[entityKey];

  return (
    <div className="grid grid-cols-[1fr_1.2fr_1fr_auto_auto] items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50 sm:grid-cols-[1fr_1.3fr_1fr_100px_auto]">
      {/* Action + Method */}
      <div className="min-w-0 flex flex-col items-start gap-2">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
            ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {log.action}
        </span>
        {log.httpMethod && (
          <span
            className={
              "  text-gray-400 inline-block rounded px-1.5 py-0.5 font-mono text-xs font-bold capitalize "
            }
          >
            method :{log.httpMethod.toUpperCase()}
          </span>
        )}
      </div>

      {/* User */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {log.actorUsername}
        </p>
        <p className="truncate text-xs text-gray-400">{log.actorEmail}</p>
        {log.actorRole && (
          <span
            className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
              ROLE_STYLES[log.actorRole.toUpperCase()] ??
              "bg-gray-100 text-gray-600"
            }`}
          >
            {log.actorRole}
          </span>
        )}
      </div>

      {/* Entity */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium capitalize text-gray-700">
          {log.entityType}
        </p>
        {entityRoute ? (
          <Link
            href={`${entityRoute}/${log.entityId}`}
            className="truncate text-xs text-blue-500 underline-offset-2 hover:underline"
          >
            {log.entityId}
          </Link>
        ) : (
          <p className="truncate font-mono text-xs text-gray-400">
            {log.entityId}
          </p>
        )}
      </div>

      {/* Time & Date */}
      <div className="hidden shrink-0 sm:block">
        <p className="text-sm font-medium text-gray-700">{timeStr}</p>
        <p className="text-xs text-gray-400">{dateStr}</p>
      </div>

      {/* Menu */}
      <div>
        <AuditLogRowMenu log={log} role={role} />
      </div>
    </div>
  );
};

// ─── Table ────────────────────────────────────────────────────────────────────

const LIMIT = 20;

const AuditLogsAdminTable = ({ role }: { role?: TRole }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = (searchParams.get("search") ?? "").toLowerCase().trim();
  const action = searchParams.get("action");
  const [sort, setSort] = useState<SortKey>("newest");

  const { data, isLoading, isError } = useAuditLogs(page, LIMIT);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
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

  const filtered: IAuditLog[] = (data.payload?.data ?? []).filter((log) => {
    const matchesSearch =
      !search ||
      log.actorUsername.toLowerCase().includes(search) ||
      log.actorEmail.toLowerCase().includes(search) ||
      log.actorRole?.toLowerCase().includes(search) ||
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

  const logs = sortLogs(filtered, sort);

  if (logs.length === 0) {
    return <p className="text-sm text-gray-500">No audit logs found.</p>;
  }

  return (
    <div className="overflow-hidden border bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 bg-blue-500 px-4 py-3 relative">
        <div className="grid flex-1 grid-cols-[1fr_1.2fr_1fr_auto] gap-4 text-sm font-semibold text-white sm:grid-cols-[1fr_1.3fr_1fr_100px]">
          <div>Action</div>
          <div>User</div>
          <div>Entity</div>
          <div className="hidden sm:block">Time</div>
        </div>
        <SortDropdown sort={sort} onSort={setSort} />
        {/* spacer aligns with row menu column */}
        <div className="w-7 shrink-0" />
      </div>

      {logs.map((log) => (
        <AuditLogRow key={log.id} log={log} role={role} />
      ))}
    </div>
  );
};

export default AuditLogsAdminTable;
