// Answer shape embedded in a question
export interface IAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Question as returned in GET /api/questions/exam/{examId} and GET /api/questions/{id}
export interface IQuestion {
  id: string;
  text: string;
  examId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  answers: IAnswer[];
}

// payload for GET /api/questions/exam/{examId}
export interface IQuestionsPayload {
  questions: IQuestion[];
}

// payload for GET /api/questions/{id}
export interface IQuestionDetailPayload {
  question: IQuestion;
}

export interface IAnswerInput {
  text: string;
  isCorrect: boolean;
}

// POST /api/questions
export interface ICreateQuestionFields {
  text: string;
  examId: string;
  answers: IAnswerInput[];
}

// PUT /api/questions/{id}
export interface IUpdateQuestionFields {
  text?: string;
  answers?: IAnswerInput[];
}

// POST /api/questions/exam/{examId}/bulk
export interface IBulkCreateQuestionsFields {
  questions: {
    text: string;
    answers: IAnswerInput[];
  }[];
}
