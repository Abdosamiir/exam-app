import { z } from "zod";

export const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
});

const answersSchema = z
  .array(answerSchema)
  .min(1, "Add at least one answer")
  .refine((answers) => answers.filter((a) => a.isCorrect).length === 1, {
    message: "Mark exactly one answer as correct",
  });

export const questionSchema = z.object({
  text: z.string().min(1, "Question headline is required"),
  examId: z.string().min(1, "Exam is required"),
  answers: answersSchema,
});

export type QuestionSchema = z.infer<typeof questionSchema>;

export const bulkQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question headline is required"),
        answers: answersSchema,
      }),
    )
    .min(1, "Add at least one question"),
});

export type BulkQuestionsSchema = z.infer<typeof bulkQuestionsSchema>;
