"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuditLogs } from "../../hooks/use-audit-logs";

const LIMIT = 20;

const AuditLogsPagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const { data } = useAuditLogs(page, LIMIT);
  const metadata = data?.status ? data.payload?.metadata : undefined;

  if (!metadata || metadata.total === 0) return null;

  const start = (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, metadata.total);

  const goTo = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-2 text-sm text-gray-600">
      <span>
        {start} - {end} of {metadata.total}
      </span>
      <div className="flex h-10 items-center gap-1 border border-gray-200">
        <button
          type="button"
          onClick={() => goTo(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex h-full w-8 items-center justify-center bg-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3">
          Page {page} of {metadata.totalPages}
        </span>
        <button
          type="button"
          onClick={() => goTo(Math.min(metadata.totalPages, page + 1))}
          disabled={page >= metadata.totalPages}
          className="flex h-full w-8 items-center justify-center bg-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AuditLogsPagination;
