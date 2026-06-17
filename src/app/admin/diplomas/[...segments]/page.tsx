import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { getNextAuthToken } from "@/shared/lib/utils/auth.util";
import { Button } from "@/shared/components/ui/button";
import { DashboardBreadcrumb } from "@/app/_components/shared/dashboard-breadcrumb";
import { getDiplomaById } from "@/features/diplomas/api/api.diplomas";
import DiplomaForm from "@/features/diplomas/components/admin/diploma-form";
import DeleteDiplomaPanel from "@/features/diplomas/components/admin/delete-diploma-panel";
import ToggleDiplomaImmutableButton from "@/features/diplomas/components/admin/toggle-diploma-immutable-button";
import {
  IDiploma,
  IDiplomaDetailPayload,
} from "@/features/diplomas/types/diploma";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { PenLine, Trash2 } from "lucide-react";

type DiplomaRouteMode = "create" | "view" | "edit" | "delete";

function resolveRoute(segments: string[]): {
  mode: DiplomaRouteMode;
  id?: string;
} {
  if (segments.length === 1 && segments[0] === "add") {
    return { mode: "create" };
  }

  if (segments.length === 1) {
    return { mode: "view", id: segments[0] };
  }

  if (segments.length === 2 && segments[1] === "edit") {
    return { mode: "edit", id: segments[0] };
  }

  if (segments.length === 2 && segments[1] === "delete") {
    return { mode: "delete", id: segments[0] };
  }

  notFound();
}

async function getRouteDiploma(id: string, token?: string) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["diplomas", id],
    queryFn: () => getDiplomaById(id, token),
  });

  const data = queryClient.getQueryData<IApiResponse<IDiplomaDetailPayload>>([
    "diplomas",
    id,
  ]);

  return { queryClient, data };
}

function resolveDiploma(payload?: IDiplomaDetailPayload): IDiploma | null {
  if (!payload) return null;
  if (payload.diploma) return payload.diploma;
  if (payload.id && payload.title) return payload as IDiploma;

  return null;
}

export default async function AdminDiplomaCatchAllPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  const route = resolveRoute(segments);
  const session = await getServerSession(authOptions);
  const jwt = await getNextAuthToken();
  const role = session?.user.role;

  if (route.mode === "create") {
    if (!hasPermission("create:diplomas", role)) notFound();

    return (
      <>
        <DashboardBreadcrumb />
        <div className="flex flex-col gap-6 p-6">
          <h1 className="text-2xl font-bold">Add diploma</h1>
          <DiplomaForm mode="create" />
        </div>
      </>
    );
  }

  const { queryClient, data } = await getRouteDiploma(route.id!, jwt?.token);

  const diploma = data?.status ? resolveDiploma(data.payload) : null;

  if (!diploma) {
    return <p className="p-6 text-sm text-destructive">Diploma not found.</p>;
  }

  if (!hasPermission("view:diplomas", role)) notFound();
  if (route.mode === "edit" && !hasPermission("update:diplomas", role))
    notFound();
  if (route.mode === "delete" && !hasPermission("delete:diplomas", role)) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardBreadcrumb />
      <div className="flex flex-col gap-6 p-6">
        {route.mode === "view" && (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold">{diploma.title}</h1>
              <div className="flex flex-wrap gap-2">
                <ToggleDiplomaImmutableButton
                  id={diploma.id}
                  immutable={diploma.immutable}
                />
                {hasPermission("update:diplomas", role) && (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none bg-primary text-white hover:bg-primary/90 hover:text-white"
                  >
                    <Link href={`/admin/diplomas/${diploma.id}/edit`}>
                      <PenLine size={14} className="text-white" />
                      Edit
                    </Link>
                  </Button>
                )}
                {hasPermission("delete:diplomas", role) && (
                  <Button
                    asChild
                    variant="destructive"
                    className="rounded-none"
                  >
                    <Link href={`/admin/diplomas/${diploma.id}/delete`}>
                      <Trash2 size={14} className="text-white" />
                      Delete
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col max-w-5xl gap-6 ">
              <div className="aspect-square w-80 overflow-hidden border bg-gray-50">
                {diploma.image ? (
                  <Image
                    src={diploma.image}
                    alt={diploma.title}
                    width={640}
                    height={640}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary/5 via-white to-primary/10" />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">{diploma.title}</h2>
                <p className="text-sm leading-6 text-gray-600">
                  {diploma.description}
                </p>
              </div>
            </div>
          </>
        )}

        {route.mode === "edit" && (
          <>
            {/* <h1 className="text-2xl font-bold">Edit {diploma.title}</h1> */}
            <DiplomaForm diploma={diploma} mode="edit" />
          </>
        )}

        {route.mode === "delete" && <DeleteDiplomaPanel diploma={diploma} />}
      </div>
    </HydrationBoundary>
  );
}
