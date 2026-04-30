"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllAuditLogs,
  deleteAuditLog,
  getAuditLogById,
  getAuditLogs,
} from "../api/api.audit-logs";

export function useAuditLogs(page: number = 1, limit: number = 20) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["audit-logs", page, limit],
    queryFn: () => getAuditLogs(session?.accessToken, page, limit),
  });
}

export function useAuditLog(id: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["audit-logs", id],
    queryFn: () => getAuditLogById(id, session?.accessToken),
    enabled: !!id,
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
