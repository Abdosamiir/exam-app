"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { hasPermission } from "@/shared/lib/utils/rbac.util";
import { useToggleDiplomaImmutable } from "../../hooks/use-diplomas";

interface Props {
  id: string;
  immutable: boolean;
}

const ToggleDiplomaImmutableButton = ({ id, immutable }: Props) => {
  const { data: session } = useSession();
  const { mutate, isPending } = useToggleDiplomaImmutable();

  if (!hasPermission("toggle-immutable:diplomas", session?.user.role)) return null;

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

export default ToggleDiplomaImmutableButton;
