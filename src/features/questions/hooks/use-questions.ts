"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getQuestionsByExam,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionImmutable,
  bulkCreateQuestions,
} from "../api/api.questions";
import {
  ICreateQuestionFields,
  IUpdateQuestionFields,
  IBulkCreateQuestionsFields,
} from "../types/question";

export function useQuestions(examId: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["questions", "exam", examId],
    queryFn: () => getQuestionsByExam(examId, session?.accessToken),
    enabled: !!examId,
  });
}

export function useQuestion(id: string) {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["questions", "detail", id],
    queryFn: () => getQuestionById(id, session?.accessToken),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateQuestionFields) =>
      createQuestion(data, session!.accessToken),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "exam", variables.examId],
      });
    },
  });
}

export function useUpdateQuestion(id: string, examId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateQuestionFields) =>
      updateQuestion(id, data, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
      queryClient.invalidateQueries({ queryKey: ["questions", "detail", id] });
    },
  });
}

export function useDeleteQuestion(examId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
    },
  });
}

export function useToggleQuestionImmutable(examId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleQuestionImmutable(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
    },
  });
}

export function useBulkCreateQuestions(examId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBulkCreateQuestionsFields) =>
      bulkCreateQuestions(examId, data, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
    },
  });
}
