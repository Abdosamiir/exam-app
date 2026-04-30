"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { hasPermission } from "@/shared/lib/utils/rbac.util";

const CreateDiplomaForm = () => {
  const { data: session } = useSession();

  if (!hasPermission("create:diplomas", session?.user.role)) return null;

  return (
    <Button
      asChild
      className="rounded-none bg-emerald-500 text-white hover:bg-emerald-600"
    >
      <Link href="/admin/diplomas/add">
        <Plus className="h-4 w-4" />
        add new diploma
      </Link>
    </Button>
  );
};

export default CreateDiplomaForm;
