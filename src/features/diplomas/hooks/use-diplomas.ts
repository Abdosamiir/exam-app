"use client";

import { useSession } from "next-auth/react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getDiplomas,
  getDiplomaById,
  createDiploma,
  updateDiploma,
  deleteDiploma,
  toggleDiplomaImmutable,
} from "../api/api.diplomas";
import { ICreateDiplomaFields, IUpdateDiplomaFields } from "../types/diploma";

const PAGE_SIZE = 6;

export function useInfiniteDiplomas() {
  const { status } = useSession();
  return useInfiniteQuery({
    queryKey: ["diplomas", "infinite"],
    queryFn: ({ pageParam }) =>
      getDiplomas({ page: pageParam as number, limit: PAGE_SIZE }),
    enabled: status === "authenticated",
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = "payload" in lastPage ? lastPage.payload?.metadata : undefined;
      if (!meta) return undefined;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });
}

export function useDiplomas(page = 1, limit = 20, search = "") {
  return useQuery({
    queryKey: ["diplomas", page, limit, search],
    queryFn: () => getDiplomas({ page, limit, search: search || undefined }),
  });
}

export function useDiploma(id: string) {
  return useQuery({
    queryKey: ["diplomas", id],
    queryFn: () => getDiplomaById(id),
    enabled: !!id,
  });
}

export function useCreateDiploma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateDiplomaFields) => createDiploma(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}

export function useUpdateDiploma(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateDiplomaFields) => updateDiploma(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
      queryClient.invalidateQueries({ queryKey: ["diplomas", id] });
    },
  });
}

export function useDeleteDiploma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiploma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}

export function useToggleDiplomaImmutable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleDiplomaImmutable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}
