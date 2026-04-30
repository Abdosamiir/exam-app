"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seedDatabase, toggleUserImmutable } from "../api/api.admin";

export function useSeedDatabase() {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: () => seedDatabase(session!.accessToken),
  });
}

export function useToggleUserImmutable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleUserImmutable(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
