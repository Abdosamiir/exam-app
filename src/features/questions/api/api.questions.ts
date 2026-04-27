import { API_BASE, authHeaders } from "@/shared/lib/utils/api.util";
import {
  IQuestionsPayload,
  IQuestionDetailPayload,
  ICreateQuestionFields,
  IUpdateQuestionFields,
  IBulkCreateQuestionsFields,
  IQuestion,
} from "../types/question";

export async function getQuestionsByExam(
  examId: string,
  token?: string
): Promise<IApiResponse<IQuestionsPayload>> {
  const res = await fetch(`${API_BASE}/questions/exam/${examId}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function getQuestionById(
  id: string,
  token?: string
): Promise<IApiResponse<IQuestionDetailPayload>> {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function createQuestion(
  data: ICreateQuestionFields,
  token: string
): Promise<IApiResponse<IQuestion>> {
  const res = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateQuestion(
  id: string,
  data: IUpdateQuestionFields,
  token: string
): Promise<IApiResponse<IQuestion>> {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteQuestion(
  id: string,
  token: string
): Promise<IApiResponse<null>> {
  const res = await fetch(`${API_BASE}/questions/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}

export async function toggleQuestionImmutable(
  id: string,
  token: string,
): Promise<IApiResponse<IQuestion>> {
  const res = await fetch(`${API_BASE}/admin/questions/${id}/immutable`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  return res.json();
}

export async function bulkCreateQuestions(
  examId: string,
  data: IBulkCreateQuestionsFields,
  token: string
): Promise<IApiResponse<IQuestionsPayload>> {
  const res = await fetch(`${API_BASE}/questions/exam/${examId}/bulk`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}
