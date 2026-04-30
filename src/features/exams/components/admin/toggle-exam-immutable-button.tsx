"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useToggleExamImmutable } from "../../hooks/use-exams";

interface Props {
  id: string;
  immutable: boolean;
}

const ToggleExamImmutableButton = ({ id, immutable }: Props) => {
  const { data: session } = useSession();
  const { mutate, isPending } = useToggleExamImmutable();

  if (!hasPermission("toggle-immutable:exams", session?.user.role)) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(id)}
      className={immutable ? "text-yellow-600 border-yellow-300" : "text-green-600 border-green-300"}
    >
      {isPending ? "…" : immutable ? "Unlock" : "Lock"}
    </Button>
  );
};

export default ToggleExamImmutableButton;
