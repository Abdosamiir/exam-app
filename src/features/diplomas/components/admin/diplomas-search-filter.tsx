"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronsDownUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const DiplomasSearchFilter = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 px-4 bg-blue-500 text-white font-semibold"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <span>Search &amp; Filters</span>
        </div>
        <div className="flex items-center gap-1 font-medium">

        <ChevronsDownUp
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
          />
          Hide
          </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-white space-y-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title"
              className="w-full pl-4 pr-4 py-2 border  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Select>
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Immutability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Immutable</SelectItem>
              <SelectItem value="false">Mutable</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900  hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800   hover:bg-gray-300"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiplomasSearchFilter;
