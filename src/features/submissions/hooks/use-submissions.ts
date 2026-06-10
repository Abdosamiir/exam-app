"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
} from "../api/api.submissions";
import { ICreateSubmissionFields } from "../types/submission";

export function useSubmissions(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["submissions", params],
    queryFn: () => getSubmissions(params),
  });
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: ["submissions", "detail", id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
  });
}

export function useCreateSubmission() {
  return useMutation({
    mutationFn: (data: ICreateSubmissionFields) => createSubmission(data),
  });
}
