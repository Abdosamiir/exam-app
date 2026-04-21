// Diploma shape embedded in exam list items (brief)
export interface IExamDiplomaBrief {
  id: string;
  title: string;
}

// Diploma shape embedded in single exam detail (full)
export interface IExamDiplomaFull extends IExamDiplomaBrief {
  description: string;
  image: string;
}

// Exam as returned in GET /api/exams list
export interface IExam {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number; // minutes
  diplomaId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  diploma: IExamDiplomaBrief;
  questionsCount: number;
}

// Exam as returned in GET /api/exams/{id}
export interface IExamDetail extends Omit<IExam, "diploma"> {
  diploma: IExamDiplomaFull;
}

export interface IExamMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// payload for GET /api/exams
export interface IExamsPayload {
  data: IExam[];
  metadata: IExamMetadata;
}

// payload for GET /api/exams/{id}
export interface IExamDetailPayload {
  exam: IExamDetail;
}

export interface ICreateExamFields {
  title: string;
  description: string;
  image?: string;
  duration: number;
  diplomaId: string;
}

export interface IUpdateExamFields {
  title?: string;
  description?: string;
  image?: string;
  duration?: number;
  diplomaId?: string;
}
