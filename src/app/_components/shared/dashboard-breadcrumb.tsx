"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { getDiplomaById } from "@/features/diplomas/api/api.diplomas";
import { getExamById } from "@/features/exams/api/api.exams";
import { getSubmissionById } from "@/features/submissions/api/api.submissions";

type BreadcrumbEntry = {
  href?: string;
  label: React.ReactNode;
};

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function DiplomaSegmentLabel({ id }: { id: string }) {
  const { data: session } = useSession();
  const { data } = useQuery({
    queryKey: ["diplomas", id],
    queryFn: () => getDiplomaById(id, session!.accessToken),
    enabled: !!id && !!session?.accessToken,
  });

  const title = data?.status
    ? (data.payload?.title ?? data.payload?.diploma?.title)
    : undefined;
  return title;
}

function BreadcrumbTrail({ items }: { items: BreadcrumbEntry[] }) {
  return (
    <>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.href ?? String(item.label)}-${index}`}>
            <BreadcrumbItem>
              {!isLast && item.href ? (
                <BreadcrumbLink
                  asChild
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-gray-400 text-sm">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        );
      })}
    </>
  );
}

function ExamBreadcrumbTrail({ id }: { id: string }) {
  const { data: session } = useSession();
  const { data } = useQuery({
    queryKey: ["exams", "detail", id],
    queryFn: () => getExamById(id, session!.accessToken),
    enabled: !!id && !!session?.accessToken,
  });

  const exam = data?.status ? data.payload?.exam : undefined;

  const items = [
    { href: "/diplomas", label: "Diplomas" },
    {
      href: exam?.diploma?.id ? `/diplomas/${exam.diploma.id}` : undefined,
      label: exam?.diploma?.title ?? "Diploma",
    },
    { href: undefined, label: exam?.title ?? "Exam" },
  ];

  return <BreadcrumbTrail items={items} />;
}

function SubmissionBreadcrumbTrail({ id }: { id: string }) {
  const { data: session } = useSession();
  const { data: submissionData } = useQuery({
    queryKey: ["submissions", "detail", id],
    queryFn: () => getSubmissionById(id, session!.accessToken),
    enabled: !!id && !!session?.accessToken,
  });

  const submission = submissionData?.status
    ? submissionData.payload?.submission
    : undefined;
  const examId = submission?.examId ?? submission?.exam?.id;

  const { data: examData } = useQuery({
    queryKey: ["exams", "detail", examId],
    queryFn: () => getExamById(examId!, session!.accessToken),
    enabled: !!examId && !!session?.accessToken,
  });

  const exam = examData?.status ? examData.payload?.exam : undefined;

  const items = [
    { href: "/diplomas", label: "Diplomas" },
    {
      href: exam?.diploma?.id ? `/diplomas/${exam.diploma.id}` : undefined,
      label: exam?.diploma?.title ?? "Diploma",
    },
    {
      href: examId ? `/exams/${examId}` : undefined,
      label:
        exam?.title ?? submission?.examTitle ?? submission?.exam?.title ?? "Exam",
    },
    { href: undefined, label: "Results" },
  ];

  return <BreadcrumbTrail items={items} />;
}

function resolveLabel(
  segment: string,
  parentSegment: string | undefined,
): React.ReactNode {
  if (parentSegment === "diplomas") {
    return <DiplomaSegmentLabel id={segment} />;
  }
  return formatSegment(segment);
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isExamDetail = segments[0] === "exams" && !!segments[1];
  const isSubmissionDetail = segments[0] === "submissions" && !!segments[1];

  return (
    <div className="bg-white px-4 py-3 border-b flex items-center gap-3 sm:px-6">
      <SidebarTrigger className="bg-blue-50" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="min-w-0 text-sm text-gray-400">
          {isExamDetail ? (
            <ExamBreadcrumbTrail id={segments[1]} />
          ) : isSubmissionDetail ? (
            <SubmissionBreadcrumbTrail id={segments[1]} />
          ) : (
            segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;
              const label = resolveLabel(segment, segments[index - 1]);

              return (
                <React.Fragment key={href}>
                  <BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbLink
                        asChild
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        <Link href={href}>{label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-gray-400 text-sm">
                        {label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
