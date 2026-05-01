"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { useDeleteAuditLog } from "../../hooks/use-audit-logs";
import { IAuditLog } from "../../types/audit-log";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-green-600",
  UPDATE: "text-amber-500",
  DELETE: "text-red-600",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "text-red-500",
  ADMIN: "text-purple-600",
  MANAGER: "text-blue-600",
  USER: "text-gray-600",
};

const ENTITY_ROUTES: Record<string, string> = {
  diploma: "/admin/diplomas",
  exam: "/admin/exams",
  question: "/admin/questions",
  user: "/admin/users",
};

function formatRole(role: string): string {
  return role
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className=" px-6 py-4 ">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function AuditLogDetailView({
  log,
  canDelete,
}: {
  log: IAuditLog;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteAuditLog();

  const date = new Date(log.createdAt);
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = date.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const entityKey = log.entityType?.toLowerCase();
  const entityRoute = ENTITY_ROUTES[entityKey];
  const metadataKeys = log.metadata ? Object.keys(log.metadata) : [];
  const showUpdatedFields = log.action === "UPDATE" && metadataKeys.length > 0;

  const handleDelete = () => {
    mutate(log.id, {
      onSuccess: (res) => {
        if (!res.status) {
          setError(res.message ?? "Failed to delete audit log.");
          return;
        }
        setOpen(false);
        router.push("/admin/audit-log");
      },
      onError: () => setError("Something went wrong. Please try again."),
    });
  };

  return (
    <>
      {canDelete && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            className="rounded-none"
            onClick={() => {
              setError(null);
              setOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      )}

      <div className="border bg-white">
        <Section label="Action">
          <span
            className={`font-mono font-bold ${ACTION_COLORS[log.action] ?? "text-gray-700"}`}
          >
            {log.action}
          </span>
        </Section>

        <Section label="Method">
          <span className="font-mono">{log.httpMethod}</span>
        </Section>

        <Section label="User">
          <p className="font-semibold text-gray-900">{log.actorUsername}</p>
          <p className="text-gray-500">Email: {log.actorEmail}</p>
          <p className="text-gray-500">IP Address: {log.ipAddress}</p>
          <p>
            Role:{" "}
            <span
              className={`font-mono font-semibold ${
                ROLE_COLORS[log.actorRole?.toUpperCase()] ?? "text-gray-700"
              }`}
            >
              {formatRole(log.actorRole ?? "")}
            </span>
          </p>
        </Section>

        <Section label="Entity">
          <span className="font-mono">
            {log.entityType}: {log.entityId}
          </span>
          {entityRoute && (
            <Link
              href={`${entityRoute}/${log.entityId}`}
              className="ml-1.5 inline-flex items-center text-gray-400 hover:text-gray-600"
            >
              <ExternalLink size={13} />
            </Link>
          )}
        </Section>

        <Section label="Date & Time">
          <span>
            {timeStr} | {dateStr}
          </span>
        </Section>

        {showUpdatedFields && (
          <Section label="Updated Fields">
            <span>{metadataKeys.join(", ")}</span>
          </Section>
        )}

        <Section label="Metadata">
          <pre className="max-h-60 overflow-auto bg-gray-200 p-3 font-mono text-xs">
            {JSON.stringify(log.metadata ?? {}, null, 2)}
          </pre>
        </Section>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm px-8 py-10 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-9 w-9 text-red-500" />
            </div>
          </div>

          <h2 className="mb-2 text-base font-bold text-red-600">
            Are you sure you want to delete this log?
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            This action is permanent and cannot be undone.
          </p>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-none"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="flex-1 rounded-none"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? "Deleting..." : "Yes, delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
