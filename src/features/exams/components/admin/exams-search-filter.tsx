"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronsDownUp, Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const ExamsSearchFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [immutable, setImmutable] = useState(
    searchParams.get("immutable") ?? "all",
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");

    if (immutable !== "all") params.set("immutable", immutable);
    else params.delete("immutable");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setImmutable("all");
    router.push(pathname);
  };

  return (
    <div className="overflow-hidden border">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between bg-blue-500 px-4 py-3 font-semibold text-white"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <span>Search &amp; Filters</span>
        </div>
        <div className="flex items-center gap-1 font-medium">
          <ChevronsDownUp
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
          Hide
        </div>
      </button>

      {isOpen && (
        <div className="space-y-3 bg-white p-4">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title"
              className="w-full border py-2 pl-4 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Select value={immutable} onValueChange={setImmutable}>
            <SelectTrigger className="w-full sm:w-1/4">
              <SelectValue placeholder="Immutability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Immutable</SelectItem>
              <SelectItem value="false">Mutable</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsSearchFilter;
