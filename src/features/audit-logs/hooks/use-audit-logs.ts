"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllAuditLogs,
  deleteAuditLog,
  getAuditLogById,
  getAuditLogs,
} from "../api/api.audit-logs";

export function useAuditLogs(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["audit-logs", page, limit],
    queryFn: () => getAuditLogs({ page, limit }),
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: ["audit-logs", id],
    queryFn: () => getAuditLogById(id),
    enabled: !!id,
  });
}

export function useDeleteAuditLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAuditLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
}

export function useDeleteAllAuditLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllAuditLogs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
}
