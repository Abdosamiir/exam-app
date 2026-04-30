"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowDownZA,
  CalendarArrowDown,
  CalendarArrowUp,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useDiplomas } from "../../hooks/use-diplomas";
import { IDiploma } from "../../types/diploma";

const LIMIT = 20;

type SortKey = "title-asc" | "title-desc" | "newest-desc" | "newest-asc";

const SORT_OPTIONS: { key: SortKey; label: string; Icon: React.ElementType }[] =
  [
    { key: "title-desc", label: "Title (descending)", Icon: ArrowDownZA },
    { key: "title-asc", label: "Title (ascending)", Icon: ArrowDownAZ },
    { key: "newest-desc", label: "Newest (descending)", Icon: CalendarArrowDown },
    { key: "newest-asc", label: "Newest (ascending)", Icon: CalendarArrowUp },
  ];

function sortDiplomas(diplomas: IDiploma[], sort: SortKey): IDiploma[] {
  return [...diplomas].sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    if (sort === "title-desc") return b.title.localeCompare(a.title);
    if (sort === "newest-asc") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

const SortDropdown = ({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (key: SortKey) => void;
}) => {
  const [open, setOpen] = useState(false);
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
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-1.5 text-sm font-semibold text-white hover:opacity-80"
      >
        Sort
        <ArrowDownWideNarrow size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-52 rounded-md border bg-white py-1 shadow-lg">
          {SORT_OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-gray-50 ${
                value === key
                  ? "bg-blue-50 font-medium text-blue-600"
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

const DiplomaRowMenu = ({ diploma }: { diploma: IDiploma }) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const canUpdate = hasPermission("update:diplomas", session?.user.role);
  const canDelete = hasPermission("delete:diplomas", session?.user.role);
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
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 rounded-md border bg-white py-1 shadow-lg">
          <Link
            href={`/admin/diplomas/${diploma.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} className="text-green-500" />
            View
          </Link>
          {canUpdate && (
            <Link
              href={`/admin/diplomas/${diploma.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <Pencil size={14} className="text-blue-500" />
              Edit
            </Link>
          )}
          {canDelete && (
            <Link
              href={`/admin/diplomas/${diploma.id}/delete`}
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

const DiplomaRow = ({ diploma }: { diploma: IDiploma }) => {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50">
      <div className="h-14 w-14 shrink-0 overflow-hidden border">
        {diploma.image ? (
          <Image
            src={diploma.image}
            alt={diploma.title}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-blue-50 via-white to-blue-100" />
        )}
      </div>

      <div className="w-1/4 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {diploma.title}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-500">{diploma.description}</p>
      </div>

      <DiplomaRowMenu diploma={diploma} />
    </div>
  );
};

const DiplomasAdminTable = () => {
  const [page] = useState(1);
  const [sort, setSort] = useState<SortKey>("newest-desc");
  const { data, isLoading, isError } = useDiplomas(page, LIMIT);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-100" />
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

  const diplomas = sortDiplomas(data.payload?.data ?? [], sort);

  if (diplomas.length === 0 && page === 1) {
    return <p className="text-sm text-gray-500">No diplomas yet.</p>;
  }

  return (
    <div className="overflow-hidden border bg-white">
      <div className="flex items-center gap-4 bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
        <div className="w-14 shrink-0">Image</div>
        <div className="w-1/4">Title</div>
        <div className="flex-1">Description</div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {diplomas.map((diploma) => (
        <DiplomaRow key={diploma.id} diploma={diploma} />
      ))}
    </div>
  );
};

export default DiplomasAdminTable;
