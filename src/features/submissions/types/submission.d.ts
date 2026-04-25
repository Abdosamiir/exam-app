export interface ISubmissionAnswer {
  questionId: string;
  answerId: string;
}

export interface ICreateSubmissionFields {
  examId: string;
  answers: ISubmissionAnswer[];
}

// Shape returned in GET /api/submissions list
export interface ISubmission {
  id: string;
  examId: string;
  examTitle: string;
  score: number; // percentage 0-100
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  exam?: {
    id: string;
    title: string;
    duration: number;
  };
}

export interface ISubmissionsPayload {
  data: ISubmission[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Answer brief shape used inside analytics items
export interface IAnswerBrief {
  id: string;
  text: string;
}

// One item in the analytics array from GET /api/submissions/{id}
export interface ISubmissionAnalyticsItem {
  questionId: string;
  questionText: string;
  selectedAnswer: IAnswerBrief;
  correctAnswer: IAnswerBrief;
  isCorrect: boolean;
}

// Submission summary from GET /api/submissions/{id}
export interface ISubmissionAnalytics {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  exam?: {
    id: string;
    title: string;
    duration: number;
  };
}

// Full payload of GET /api/submissions/{id}
export interface ISubmissionAnalyticsPayload {
  submission: ISubmissionAnalytics;
  analytics: ISubmissionAnalyticsItem[];
}

export interface ICreateSubmissionResponsePayload {
  submission: { id: string };
}
