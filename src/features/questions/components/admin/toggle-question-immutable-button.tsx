"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { USER_ROLES } from "@/features/auth/constants/user.constant";
import { useToggleQuestionImmutable } from "../../hooks/use-questions";

interface Props {
  id: string;
  examId: string;
  immutable: boolean;
}

const ToggleQuestionImmutableButton = ({ id, examId, immutable }: Props) => {
  const { data: session } = useSession();
  const { mutate, isPending } = useToggleQuestionImmutable(examId);

  if (session?.user.role !== USER_ROLES.superAdmin) return null;

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

export default ToggleQuestionImmutableButton;
