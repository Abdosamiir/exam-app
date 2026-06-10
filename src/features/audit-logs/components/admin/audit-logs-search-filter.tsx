"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronsDownUp, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAuditLogs } from "../../hooks/use-audit-logs";

const AuditLogsSearchFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [action, setAction] = useState(searchParams.get("action") ?? "all");
  const [user, setUser] = useState(searchParams.get("user") ?? "all");

  const { data } = useAuditLogs(1, 100);
  const logs = useMemo(
    () => (data && "payload" in data ? (data.payload?.data ?? []) : []),
    [data],
  );

  const categories = useMemo(
    () =>
      Array.from(new Set(logs.map((log) => log.category).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [logs],
  );

  const users = useMemo(
    () =>
      Array.from(
        new Map(
          logs
            .filter((log) => log.actorUserId)
            .map((log) => [
              log.actorUserId,
              {
                id: log.actorUserId,
                label: log.actorUsername || log.actorEmail || log.actorUserId,
              },
            ]),
        ).values(),
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [logs],
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    params.delete("search");

    if (category !== "all") params.set("category", category);
    else params.delete("category");

    if (action !== "all") params.set("action", action);
    else params.delete("action");

    if (user !== "all") params.set("user", user);
    else params.delete("user");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory("all");
    setAction("all");
    setUser("all");
    router.push(pathname);
  };

  return (
    <div className="overflow-hidden border">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between bg-primary px-4 py-3 font-semibold text-white"
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
          <div className="flex flex-wrap gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((categoryItem) => (
                  <SelectItem key={categoryItem} value={categoryItem}>
                    {categoryItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-full sm:w-1/4">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                {users.map((userItem) => (
                  <SelectItem key={userItem.id} value={userItem.id}>
                    {userItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

export default AuditLogsSearchFilter;
