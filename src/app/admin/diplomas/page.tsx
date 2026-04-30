import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import { Suspense } from "react";
import DiplomasAdminTable from "@/features/diplomas/components/admin/diplomas-admin-table";
import DiplomasPagination from "@/features/diplomas/components/admin/diplomas-pagination";
import CreateDiplomaForm from "@/features/diplomas/components/admin/create-diploma-form";
import DiplomasSearchFilter from "@/features/diplomas/components/admin/diplomas-search-filter";
import SeedButton from "@/features/admin/components/seed-button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";

export default async function AdminDiplomasPage() {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["diplomas", 1, 20],
    queryFn: () => getDiplomas(session?.accessToken, 1, 20),
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
          <DiplomasSearchFilter />
        </div>
        <Suspense>
          <DiplomasAdminTable />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
