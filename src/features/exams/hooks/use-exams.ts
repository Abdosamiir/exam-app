"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} from "../api/api.exams";
import { ICreateExamFields, IUpdateExamFields } from "../types/exam";

export function useExams(diplomaId?: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["exams", diplomaId ?? "all"],
    queryFn: () => getExams({ diplomaId }, session?.accessToken),
  });
}

export function useExam(id: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["exams", "detail", id],
    queryFn: () => getExamById(id, session?.accessToken),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateExamFields) =>
      createExam(data, session!.accessToken),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", variables.diplomaId] });
    },
  });
}

export function useUpdateExam(id: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateExamFields) =>
      updateExam(id, data, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", "detail", id] });
    },
  });
}

export function useDeleteExam() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExam(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
