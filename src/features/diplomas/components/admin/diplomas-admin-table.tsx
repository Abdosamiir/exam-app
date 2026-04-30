"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownAZ,
  ArrowDownZA,
  CalendarArrowDown,
  CalendarArrowUp,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ArrowDownWideNarrow,
} from "lucide-react";
import { useDiplomas, useDeleteDiploma } from "../../hooks/use-diplomas";
import { IDiploma } from "../../types/diploma";
import EditDiplomaForm from "./edit-diploma-form";

const LIMIT = 20;

type SortKey = "title-asc" | "title-desc" | "newest-desc" | "newest-asc";

const SORT_OPTIONS: { key: SortKey; label: string; Icon: React.ElementType }[] =
  [
    { key: "title-desc", label: "Title (descending)", Icon: ArrowDownZA },
    { key: "title-asc", label: "Title (ascending)", Icon: ArrowDownAZ },
    {
      key: "newest-desc",
      label: "Newest (descending)",
      Icon: CalendarArrowDown,
    },
    { key: "newest-asc", label: "Newest (ascending)", Icon: CalendarArrowUp },
  ];

function sortDiplomas(diplomas: IDiploma[], sort: SortKey): IDiploma[] {
  return [...diplomas].sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "title-desc") return b.title.localeCompare(a.title);
    if (sort === "newest-asc")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// ── Sort dropdown ─────────────────────────────────────────────────────────────
const SortDropdown = ({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) => {
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-white text-sm font-semibold hover:opacity-80"
      >
        Sort
        <ArrowDownWideNarrow size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-52 rounded-md border bg-white shadow-lg py-1">
          {SORT_OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
              className={`flex w-full text-xs items-center gap-2.5 px-3 py-2  hover:bg-gray-50 ${
                value === key
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── 3-dot dropdown ────────────────────────────────────────────────────────────
const DiplomaRowMenu = ({
  diploma,
  onEdit,
}: {
  diploma: IDiploma;
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useDeleteDiploma();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        className="p-1.5  bg-gray-200 text-gray-800 hover:bg-gray-100  hover:text-gray-700"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 rounded-md border bg-white shadow-lg py-1">
          {!confirming ? (
            <>
              <Link
                href={`/diplomas/${diploma.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <Eye size={14} className="text-green-500" />
                View
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
              >
                <Pencil size={14} className="text-blue-500" />
                Edit
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm "
                onClick={() => setConfirming(true)}
              >
                <Trash2 size={14} className="text-red-500" />
                Delete
              </button>
            </>
          ) : (
            <div className="px-3 py-2 space-y-2">
              <p className="text-xs text-gray-600">Are you sure?</p>
              <div className="flex gap-1">
                <button
                  disabled={isPending}
                  className="flex-1 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                  onClick={() => mutate(diploma.id)}
                >
                  {isPending ? "…" : "Delete"}
                </button>
                <button
                  className="flex-1 rounded border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── single row ────────────────────────────────────────────────────────────────
const DiplomaRow = ({
  diploma,
  editingId,
  setEditingId,
}: {
  diploma: IDiploma;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}) => {
  const isEditing = editingId === diploma.id;

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
        {/* Image */}
        <div className="w-14 h-14 shrink-0 overflow-hidden border">
          {diploma.image ? (
            <Image
              src={diploma.image}
              alt={diploma.title}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-50 via-white to-blue-100" />
          )}
        </div>

        {/* Title */}
        <div className="w-1/4 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">
            {diploma.title}
          </p>
        </div>

        {/* Description */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">
            {diploma.description}
          </p>
        </div>

        {/* Menu */}
        <DiplomaRowMenu
          diploma={diploma}
          onEdit={() => setEditingId(isEditing ? null : diploma.id)}
        />
      </div>

      {isEditing && (
        <div className="bg-gray-50 px-4 py-4 border-b">
          <EditDiplomaForm
            diploma={diploma}
            onClose={() => setEditingId(null)}
          />
        </div>
      )}
    </>
  );
};

// ── pagination bar ─────────────────────────────────────────────────────────────
// const PaginationBar = ({
//   page,
//   totalPages,
//   total,
//   onPrev,
//   onNext,
// }: {
//   page: number;
//   totalPages: number;
//   total: number;
//   onPrev: () => void;
//   onNext: () => void;
// }) => {
//   const start = (page - 1) * LIMIT + 1;
//   const end = Math.min(page * LIMIT, total);

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-b bg-white text-sm text-gray-600">
//       <span>
//         {start} – {end} of {total}
//       </span>
//       <div className="flex items-center gap-1">
//         <button
//           type="button"
//           onClick={onPrev}
//           disabled={page <= 1}
//           className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//           aria-label="Previous page"
//         >
//           <ChevronLeft size={16} />
//         </button>
//         <span className="px-3">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           type="button"
//           onClick={onNext}
//           disabled={page >= totalPages}
//           className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//           aria-label="Next page"
//         >
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// ── main list ─────────────────────────────────────────────────────────────────
const DiplomasAdminTable = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>("newest-desc");
  const { data, isLoading, isError } = useDiplomas(page, LIMIT);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-destructive">
        Failed to load diplomas. Please try again.
      </p>
    );
  }

  const raw: IDiploma[] = data.payload?.data ?? [];
  const diplomas = sortDiplomas(raw, sort);
  const metadata = data.payload?.metadata;

  if (diplomas.length === 0 && page === 1) {
    return <p className="text-sm text-gray-500">No diplomas yet.</p>;
  }

  return (
    <div className="border overflow-hidden bg-white">
      {/* Column header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-blue-500 text-white text-sm font-semibold">
        <div className="w-14 shrink-0">Image</div>
        <div className="w-1/4">Title</div>
        <div className="flex-1">Description</div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Pagination */}
      {/* {metadata && (
        <PaginationBar
          page={page}
          totalPages={metadata.totalPages}
          total={metadata.total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
        />
      )} */}

      {/* Rows */}
      {diplomas.map((diploma) => (
        <DiplomaRow
          key={diploma.id}
          diploma={diploma}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      ))}
    </div>
  );
};

export default DiplomasAdminTable;
