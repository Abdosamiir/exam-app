"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDiplomas } from "../../hooks/use-diplomas";

const LIMIT = 20;

const DiplomasPagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data } = useDiplomas(page, LIMIT);
  const metadata = data?.payload?.metadata;

  if (!metadata || metadata.total === 0) return null;

  const start = (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, metadata.total);

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>
        {start} – {end} of {metadata.total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
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
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DiplomasPagination;
