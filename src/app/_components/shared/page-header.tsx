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
    <div className="flex items-center justify-center gap-2 w-full pt-6">
      <button
        onClick={() => router.back()}
        className="h-full cursor-pointer flex items-center justify-center text-blue-600 border border-blue-600 ml-6"
      >
        <ChevronLeftIcon />
      </button>
      <div className="bg-blue-600 px-6 py-4 w-full">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          {firstSegment === "exams" ? (
            <BookOpenCheck className="inline-block size-8" />
          ) : firstSegment === "account" ? (
            <UserRound className="inline-block size-8" />
          ) : (
            <GraduationCap className="inline-block size-8" />
          )}
          {formatPageName(firstSegment)}
        </h1>
      </div>
    </div>
  );
}
