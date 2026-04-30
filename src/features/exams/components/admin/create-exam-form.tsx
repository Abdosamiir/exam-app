"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { hasPermission } from "@/shared/lib/utils/rbac.util";

const CreateExamForm = () => {
  const { data: session } = useSession();

  if (!hasPermission("create:exams", session?.user.role)) return null;

  return (
    <Button asChild className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white">
      <Link href="/admin/exams/add">
        <Plus className="h-4 w-4" />
       Create New Exam
      </Link>
    </Button>
  );
};

export default CreateExamForm;
