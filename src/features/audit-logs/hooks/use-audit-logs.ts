"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllAuditLogs,
  deleteAuditLog,
  getAuditLogs,
} from "../api/api.audit-logs";

export function useAuditLogs(page: number = 1) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["audit-logs", page],
    queryFn: () => getAuditLogs(session?.accessToken, page),
  });
}

export function useDeleteAuditLog() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAuditLog(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
}

export function useDeleteAllAuditLogs() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllAuditLogs(session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
}
