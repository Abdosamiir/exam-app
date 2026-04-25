"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
} from "../api/api.submissions";
import { ICreateSubmissionFields } from "../types/submission";

export function useSubmissions(params?: { page?: number; limit?: number }) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["submissions", params],
    queryFn: () => getSubmissions(params, session?.accessToken),
  });
}

export function useSubmission(id: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["submissions", "detail", id],
    queryFn: () => getSubmissionById(id, session?.accessToken),
    enabled: !!id,
  });
}

export function useCreateSubmission() {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: ICreateSubmissionFields) =>
      createSubmission(data, session!.accessToken),
  });
}
