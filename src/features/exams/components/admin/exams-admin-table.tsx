"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  FileQuestion,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { TRole } from "@/features/auth/types/user";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useExams } from "../../hooks/use-exams";
import { IExam } from "../../types/exam";

const ExamRowMenu = ({ exam, role }: { exam: IExam; role?: TRole }) => {
  const [open, setOpen] = useState(false);
  const canUpdate = hasPermission("update:exams", role);
  const canDelete = hasPermission("delete:exams", role);
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
        <div className="absolute right-0 top-8 z-20 w-44 rounded-md border bg-white py-1 shadow-lg">
          <Link
            href={`/admin/exams/${exam.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Eye size={14} className="text-green-500" />
            View
          </Link>
          <Link
            href={`/admin/exams/${exam.id}/questions`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <FileQuestion size={14} className="text-violet-500" />
            Questions
          </Link>
          {canUpdate && (
            <Link
              href={`/admin/exams/${exam.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <Pencil size={14} className="text-blue-500" />
              Edit
            </Link>
          )}
          {canDelete && (
            <Link
              href={`/admin/exams/${exam.id}/delete`}
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

const ExamRow = ({ exam, role }: { exam: IExam; role?: TRole }) => {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50">
      <div className="h-14 w-14 shrink-0 overflow-hidden border">
        {exam.image ? (
          <Image
            src={exam.image}
            alt={exam.title}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-blue-50 via-white to-blue-100" />
        )}
      </div>

      <div className="min-w-0 max-w-[180px] flex-[1_1_180px] sm:max-w-[320px] sm:flex-[1_1_320px] lg:max-w-[440px]">
        <p className="truncate text-sm font-medium text-gray-900">
          {exam.title}
        </p>
      </div>

      <div className="hidden w-40 min-w-0 md:block">
        <p className="truncate text-sm text-gray-600">{exam.diploma.title}</p>
      </div>

      <div className="hidden w-28 text-sm text-gray-500 lg:block">
        {exam.duration} min
      </div>

      <div className="ml-auto">
        <ExamRowMenu exam={exam} role={role} />
      </div>
    </div>
  );
};

const ExamsAdminTable = ({ role }: { role?: TRole }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = (searchParams.get("search") ?? "").toLowerCase().trim();
  const immutable = searchParams.get("immutable");
  const { data, isLoading, isError } = useExams(undefined, page, 20);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-destructive">
        Failed to load exams. Please try again.
      </p>
    );
  }

  const exams: IExam[] = (data.payload?.data ?? []).filter((exam) => {
    const matchesSearch = !search || exam.title.toLowerCase().includes(search);
    const matchesImmutable =
      immutable !== "true" && immutable !== "false"
        ? true
        : String(exam.immutable) === immutable;

    return matchesSearch && matchesImmutable;
  });

  if (exams.length === 0) {
    return <p className="text-sm text-gray-500">No exams yet.</p>;
  }

  return (
    <div className="overflow-hidden border bg-white">
      <div className="flex items-center gap-4 bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
        <div className="w-14 shrink-0">Image</div>
        <div className="max-w-[180px] flex-[1_1_180px] sm:max-w-[320px] sm:flex-[1_1_320px] lg:max-w-[440px]">
          Title
        </div>
        <div className="hidden w-40 md:block">Diploma</div>
        <div className="hidden w-28 lg:block">Duration</div>
        <div className="ml-auto w-7" />
      </div>

      {exams.map((exam) => (
        <ExamRow key={exam.id} exam={exam} role={role} />
      ))}
    </div>
  );
};

export default ExamsAdminTable;
