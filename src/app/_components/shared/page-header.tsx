"use client";

import {
  BookOpenCheck,
  ChevronLeftIcon,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function formatPageName(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (!firstSegment) return null;

  return (
    <div className="flex w-full items-center gap-2 px-4 pt-4 sm:px-6 sm:pt-6">
      <button
        onClick={() => router.back()}
        className="flex min-h-full w-8 shrink-0 cursor-pointer items-center justify-center self-stretch border border-blue-600 text-blue-600"
        aria-label="Go back"
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <div className="min-w-0 flex-1 bg-blue-600 px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="flex min-w-0 items-center gap-2 truncate text-lg font-semibold text-white sm:text-xl">
          {firstSegment === "exams" ? (
            <BookOpenCheck className="inline-block size-7 shrink-0 sm:size-8" />
          ) : firstSegment === "account" ? (
            <UserRound className="inline-block size-7 shrink-0 sm:size-8" />
          ) : (
            <GraduationCap className="inline-block size-7 shrink-0 sm:size-8" />
          )}
          <span className="min-w-0 truncate">{formatPageName(firstSegment)}</span>
        </h1>
      </div>
    </div>
  );
}
