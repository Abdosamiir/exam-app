"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteDiplomas } from "../hooks/use-diplomas";
import DiplomaCard from "./diploma-card";
import { IDiploma } from "../types/diploma";

const SkeletonGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-3 gap-3 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-100" />
    ))}
  </div>
);

const DiplomasList = () => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteDiplomas();

  if (isLoading) return <SkeletonGrid count={6} />;

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
