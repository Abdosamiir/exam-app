"use client";

import { useDiplomas } from "../hooks/use-diplomas";
import DiplomaCard from "./diploma-card";

const DiplomasList = () => {
  const { data, isLoading, isError } = useDiplomas();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-100" />
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

  const diplomas = data.payload?.data ?? [];

  if (diplomas.length === 0) {
    return <p className="text-sm text-gray-500">No diplomas found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {diplomas.map((diploma) => (
        <DiplomaCard key={diploma.id} diploma={diploma} />
      ))}
    </div>
  );
};

export default DiplomasList;
