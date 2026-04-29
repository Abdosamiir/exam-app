"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useSession } from "next-auth/react";
import { useInfiniteDiplomas } from "../hooks/use-diplomas";
import DiplomaCard from "./diploma-card";
import { IDiploma } from "../types/diploma";

const guestDiplomas: IDiploma[] = [
  {
    id: "Product Management",
    title: "Product Management",
    description: "Learn how to manage digital products.",
    image:
      "https://exam-app.elevate-bootcamp.cloud/storage/entities/diploma/diploma-89a7cfa0a559-1773249871108.png",
    immutable: true,
    createdAt: "",
    updatedAt: "",
    diploma: { id: "frontend", title: "Frontend" },
  },
  {
    id: "Software Testing",
    title: "Software Testing",
    description: " Learn manual and automated testing",
    image:
      "https://exam-app.elevate-bootcamp.cloud/storage/entities/diploma/diploma-0968d04d899f-1773249815229.jpeg",
    immutable: true,
    createdAt: "",
    updatedAt: "",
    diploma: { id: "backend", title: "Backend" },
  },
  {
    id: "Artificial Intelligence",
    title: "Artificial Intelligence",
    description: "Understand AI concepts and applications",
    image:
      "https://exam-app.elevate-bootcamp.cloud/storage/entities/diploma/diploma-1d5ddf8b8584-1773249758887.jpeg",
    immutable: true,
    createdAt: "",
    updatedAt: "",
    diploma: { id: "full-stack", title: "Full Stack" },
  },
  {
    id: "e6b847b6-4172-403d-9ca6-ad0167e6814b",
    title: "Game Development",
    description: "Create games using modern engines",
    image:
      "https://exam-app.elevate-bootcamp.cloud/storage/entities/diploma/diploma-ab887bb29988-1773249599985.jpeg",
    immutable: true,
    createdAt: "2026-03-11T17:19:59.977Z",
    updatedAt: "2026-03-11T17:19:59.989Z",
    diploma: { id: "game dev", title: "game dev" },
  },
  {
    id: "23bd1dbe-c13b-441f-b071-cb4c2f05c9c4",
    title: "Cyber Security",
    description: "Protect systems and networks from attacks",
    image:
      "https://exam-app.elevate-bootcamp.cloud/storage/entities/diploma/diploma-aa8526e7428c-1773249420255.webp",
    immutable: true,
    createdAt: "2026-03-11T17:17:00.246Z",
    updatedAt: "2026-03-11T17:17:00.257Z",
    diploma: { id: "cyber sec", title: "cyber sec" },
  },
  {
    id: "68412923-120b-4c2c-a1b7-95221c523469",
    title: "Blockchain Development",
    description: "Build decentralized applications",
    image:
      "https://exam-app.elevate-bootcamp.cloud/storage/entities/diploma/diploma-f1d25262441d-1773249687896.png",
    immutable: true,
    createdAt: "2026-03-11T17:21:27.889Z",
    updatedAt: "2026-03-11T17:21:27.897Z",
    diploma: { id: "block chain", title: "block-chain" },
  },
];

const SkeletonGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-3 gap-3 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-100" />
    ))}
  </div>
);

const DiplomasList = () => {
  const { status } = useSession();
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteDiplomas();

  if (status === "loading" || isLoading) return <SkeletonGrid count={6} />;

  if (status === "unauthenticated") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {guestDiplomas.map((diploma) => (
          <DiplomaCard key={diploma.id} diploma={diploma} href="/register" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Failed to load diplomas. Please try again.
      </p>
    );
  }

  const diplomas: IDiploma[] = data.pages.flatMap((page) =>
    page.status ? (page.payload?.data ?? []) : [],
  );

  if (diplomas.length === 0) {
    return <p className="text-sm text-gray-500">No diplomas found.</p>;
  }

  return (
    <InfiniteScroll
      dataLength={diplomas.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<SkeletonGrid count={3} />}
      endMessage={
        <p className="mt-6 text-center text-sm text-gray-500">
          <b>End of all diplomas</b>
        </p>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3">
        {diplomas.map((diploma) => (
          <DiplomaCard key={diploma.id} diploma={diploma} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default DiplomasList;
