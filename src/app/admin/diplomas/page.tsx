import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getDiplomas } from "@/features/diplomas/api/api.diplomas";
import DiplomasAdminTable from "@/features/diplomas/components/admin/diplomas-admin-table";
import CreateDiplomaForm from "@/features/diplomas/components/admin/create-diploma-form";

export default async function AdminDiplomasPage() {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["diplomas"],
    queryFn: () => getDiplomas(session?.accessToken),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Diplomas</h1>
          <CreateDiplomaForm />
        </div>
        <DiplomasAdminTable />
      </div>
    </HydrationBoundary>
  );
}
