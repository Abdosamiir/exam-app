"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  toggleExamImmutable,
} from "../api/api.exams";
import { ICreateExamFields, IUpdateExamFields } from "../types/exam";

const PAGE_SIZE = 6;

export function useInfiniteExams(diplomaId?: string) {
  return useInfiniteQuery({
    queryKey: ["exams", "infinite", diplomaId ?? "all"],
    queryFn: ({ pageParam }) =>
      getExams({ diplomaId, page: pageParam as number, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = "payload" in lastPage ? lastPage.payload?.metadata : undefined;
      if (!meta) return undefined;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });
}

export function useExams(diplomaId?: string, page?: number, limit?: number) {
  return useQuery({
    queryKey: ["exams", diplomaId ?? "all", page, limit],
    queryFn: () => getExams({ diplomaId, page, limit }),
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: ["exams", "detail", id],
    queryFn: () => getExamById(id),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateExamFields) => createExam(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", variables.diplomaId] });
    },
  });
}

export function useUpdateExam(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateExamFields) => updateExam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", "detail", id] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}

export function useToggleExamImmutable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleExamImmutable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
