import {
  IQuestionsPayload,
  IQuestionDetailPayload,
  ICreateQuestionFields,
  IUpdateQuestionFields,
  IBulkCreateQuestionsFields,
  IQuestion,
} from "../types/question";

const BASE = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getQuestionsByExam(
  examId: string,
  token?: string
): Promise<IApiResponse<IQuestionsPayload>> {
  const res = await fetch(`${BASE}/questions/exam/${examId}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function getQuestionById(
  id: string,
  token?: string
): Promise<IApiResponse<IQuestionDetailPayload>> {
  const res = await fetch(`${BASE}/questions/${id}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  return res.json();
}

export async function createQuestion(
  data: ICreateQuestionFields,
  token: string
): Promise<IApiResponse<IQuestion>> {
  const res = await fetch(`${BASE}/questions`, {
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
  const res = await fetch(`${BASE}/questions/${id}`, {
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
  const res = await fetch(`${BASE}/questions/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}

export async function bulkCreateQuestions(
  examId: string,
  data: IBulkCreateQuestionsFields,
  token: string
): Promise<IApiResponse<IQuestionsPayload>> {
  const res = await fetch(`${BASE}/questions/exam/${examId}/bulk`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}
