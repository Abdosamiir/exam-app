import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNextAuthToken } from "@/shared/lib/utils/auth.util";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import { Suspense } from "react";
import DiplomasAdminTable from "@/features/diplomas/components/admin/diplomas-admin-table";
import DiplomasPagination from "@/features/diplomas/components/admin/diplomas-pagination";
import CreateDiplomaForm from "@/features/diplomas/components/admin/create-diploma-form";
import DiplomasSearchFilter from "@/features/diplomas/components/admin/diplomas-search-filter";
import SeedButton from "@/features/admin/components/seed-button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";

export default async function AdminDiplomasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const search = (searchParam ?? "").trim();
  const jwt = await getNextAuthToken();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["diplomas", page, 20, search],
    queryFn: () =>
      getDiplomas({ page, limit: 20, search: search || undefined }, jwt?.token),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Suspense fallback={null}>
              <DiplomasPagination />
            </Suspense>
            <div className="flex items-center gap-3">
              <SeedButton />
              <CreateDiplomaForm />
            </div>
          </div>
          <Suspense fallback={null}>
            <DiplomasSearchFilter />
          </Suspense>
        </div>
        <Suspense>
          <DiplomasAdminTable />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
