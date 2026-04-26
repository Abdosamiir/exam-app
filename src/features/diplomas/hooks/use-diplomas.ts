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
} from "../api/api.diplomas";
import { ICreateDiplomaFields, IUpdateDiplomaFields } from "../types/diploma";

const PAGE_SIZE = 6;

export function useInfiniteDiplomas() {
  const { data: session } = useSession();
  return useInfiniteQuery({
    queryKey: ["diplomas", "infinite"],
    queryFn: ({ pageParam }) =>
      getDiplomas(session?.accessToken, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = "payload" in lastPage ? lastPage.payload?.metadata : undefined;
      if (!meta) return undefined;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });
}

export function useDiplomas() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["diplomas"],
    queryFn: () => getDiplomas(session?.accessToken),
  });
}

export function useDiploma(id: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["diplomas", id],
    queryFn: () => getDiplomaById(id, session?.accessToken),
    enabled: !!id,
  });
}

export function useCreateDiploma() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateDiplomaFields) =>
      createDiploma(data, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}

export function useUpdateDiploma(id: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateDiplomaFields) =>
      updateDiploma(id, data, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
      queryClient.invalidateQueries({ queryKey: ["diplomas", id] });
    },
  });
}

export function useDeleteDiploma() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiploma(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}
