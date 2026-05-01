"use client";

import { Ban } from "lucide-react";
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
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(id)}
      className={`rounded-none gap-1.5 ${
        immutable
          ? "border-yellow-300 text-yellow-600 hover:bg-yellow-50"
          : "text-gray-700"
      }`}
    >
      <Ban size={15} />
      {isPending ? "…" : "Immutable"}
    </Button>
  );
};

export default ToggleQuestionImmutableButton;
