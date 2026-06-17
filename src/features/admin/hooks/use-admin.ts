"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seedDatabase, toggleUserImmutable } from "../api/api.admin";

export function useSeedDatabase() {
  return useMutation({
    mutationFn: () => seedDatabase(),
  });
}

export function useToggleUserImmutable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleUserImmutable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
