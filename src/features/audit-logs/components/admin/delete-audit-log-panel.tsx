"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { useDeleteAuditLog } from "../../hooks/use-audit-logs";
import { IAuditLog } from "../../types/audit-log";

const DeleteAuditLogPanel = ({ log }: { log: IAuditLog }) => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteAuditLog();

  return (
    <div className="flex max-w-xl flex-col gap-4 border bg-white p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-950">
          Delete audit log
        </h2>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this {log.action.toLowerCase()} log?
        </p>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            mutate(log.id, {
              onSuccess: (res) => {
                if (!res.status) {
                  setFormError(res.message ?? "Failed to delete audit log.");
                  return;
                }

                router.push("/admin/audit-log");
              },
              onError: () =>
                setFormError("Something went wrong. Please try again."),
            })
          }
        >
          {isPending ? "Deleting..." : "Yes, delete"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/admin/audit-log/${log.id}`}>Cancel</Link>
        </Button>
      </div>
    </div>
  );
};

export default DeleteAuditLogPanel;
