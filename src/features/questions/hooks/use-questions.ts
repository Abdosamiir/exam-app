"use client";

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
  return useQuery({
    queryKey: ["questions", "exam", examId],
    queryFn: () => getQuestionsByExam(examId),
    enabled: !!examId,
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["questions", "detail", id],
    queryFn: () => getQuestionById(id),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateQuestionFields) => createQuestion(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", "exam", variables.examId],
      });
    },
  });
}

export function useUpdateQuestion(id: string, examId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateQuestionFields) => updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
      queryClient.invalidateQueries({ queryKey: ["questions", "detail", id] });
    },
  });
}

export function useDeleteQuestion(examId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
    },
  });
}

export function useToggleQuestionImmutable(examId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleQuestionImmutable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
    },
  });
}

export function useBulkCreateQuestions(examId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBulkCreateQuestionsFields) =>
      bulkCreateQuestions(examId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "exam", examId] });
    },
  });
}
