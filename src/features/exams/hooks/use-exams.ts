"use client";

import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  return useInfiniteQuery({
    queryKey: ["exams", "infinite", diplomaId ?? "all"],
    queryFn: ({ pageParam }) =>
      getExams(
        { diplomaId, page: pageParam as number, limit: PAGE_SIZE },
        session?.accessToken,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = "payload" in lastPage ? lastPage.payload?.metadata : undefined;
      if (!meta) return undefined;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });
}

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

export function useToggleExamImmutable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleExamImmutable(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}
