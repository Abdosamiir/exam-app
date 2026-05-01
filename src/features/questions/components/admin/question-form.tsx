"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Save, X, LayoutGrid, Trash2, Check, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useExams } from "@/features/exams/hooks/use-exams";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useBulkCreateQuestions,
} from "../../hooks/use-questions";
import {
  IQuestion,
  ICreateQuestionFields,
  IUpdateQuestionFields,
} from "../../types/question";

type BulkAnswer = { text: string; isCorrect: boolean };
type BulkQuestion = { text: string; answers: BulkAnswer[] };

interface QuestionFormProps {
  examId: string;
  question?: IQuestion;
  mode: "create" | "edit";
}

const QuestionForm = ({ examId, question, mode }: QuestionFormProps) => {
  const router = useRouter();

  // ── mode toggle ────────────────────────────────────────────────────────────
  const [bulkMode, setBulkMode] = useState(false);

  // ── shared ─────────────────────────────────────────────────────────────────
  const [selectedExamId, setSelectedExamId] = useState(examId);
  const { data: examsData } = useExams();
  const exams = examsData?.status ? (examsData.payload?.data ?? []) : [];

  // ── single-mode ────────────────────────────────────────────────────────────
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingAnswer, setPendingAnswer] = useState("");
  const [showPending, setShowPending] = useState(false);

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion(question?.id ?? "", examId);
  const singlePending = createQuestion.isPending || updateQuestion.isPending;

  const form = useForm<ICreateQuestionFields>({
    defaultValues: {
      text: question?.text ?? "",
      examId,
      answers:
        question?.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })) ?? [],
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "answers",
  });
  const watchedAnswers = useWatch({ control: form.control, name: "answers" });

  const handleMarkCorrect = (index: number) => {
    fields.forEach((_, i) =>
      update(i, { ...form.getValues(`answers.${i}`), isCorrect: i === index }),
    );
  };

  const handleAddPendingAnswer = () => {
    if (!pendingAnswer.trim()) return;
    append({ text: pendingAnswer.trim(), isCorrect: false });
    setPendingAnswer("");
    setShowPending(false);
  };

  const onSingleSubmit = (data: ICreateQuestionFields) => {
    setFormError(null);
    if (mode === "create") {
      createQuestion.mutate(data, {
        onSuccess: (res) => {
          if (!res.status || !res.payload) {
            setFormError(res.message ?? "Failed to create question.");
            return;
          }
          router.push(`/admin/exams/${examId}/questions/${res.payload.question.id}`);
        },
        onError: () => setFormError("Something went wrong. Please try again."),
      });
      return;
    }
    const updateData: IUpdateQuestionFields = { text: data.text, answers: data.answers };
    updateQuestion.mutate(updateData, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to update question.");
          return;
        }
        router.push(`/admin/exams/${examId}/questions/${question!.id}`);
      },
      onError: () => setFormError("Something went wrong. Please try again."),
    });
  };

  // ── bulk-mode ──────────────────────────────────────────────────────────────
  const [bulkQuestions, setBulkQuestions] = useState<BulkQuestion[]>([
    { text: "", answers: [] },
  ]);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [bulkPendingAnswer, setBulkPendingAnswer] = useState("");
  const [bulkShowPending, setBulkShowPending] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const bulkCreate = useBulkCreateQuestions(selectedExamId);
  const activeQ = bulkQuestions[activeQIdx];

  const switchTab = (i: number) => {
    setActiveQIdx(i);
    setBulkPendingAnswer("");
    setBulkShowPending(false);
  };

  const addBulkQuestion = () => {
    const next = bulkQuestions.length;
    setBulkQuestions((prev) => [...prev, { text: "", answers: [] }]);
    switchTab(next);
  };

  const removeBulkQuestion = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bulkQuestions.length === 1) return;
    setBulkQuestions((prev) => prev.filter((_, j) => j !== i));
    setActiveQIdx((prev) => Math.min(prev, bulkQuestions.length - 2));
  };

  const updateBulkText = (text: string) =>
    setBulkQuestions((prev) =>
      prev.map((q, i) => (i === activeQIdx ? { ...q, text } : q)),
    );

  const addBulkAnswer = () => {
    if (!bulkPendingAnswer.trim()) return;
    setBulkQuestions((prev) =>
      prev.map((q, i) =>
        i === activeQIdx
          ? { ...q, answers: [...q.answers, { text: bulkPendingAnswer.trim(), isCorrect: false }] }
          : q,
      ),
    );
    setBulkPendingAnswer("");
    setBulkShowPending(false);
  };

  const removeBulkAnswer = (aIdx: number) =>
    setBulkQuestions((prev) =>
      prev.map((q, i) =>
        i === activeQIdx ? { ...q, answers: q.answers.filter((_, j) => j !== aIdx) } : q,
      ),
    );

  const markBulkCorrect = (aIdx: number) =>
    setBulkQuestions((prev) =>
      prev.map((q, i) =>
        i === activeQIdx
          ? { ...q, answers: q.answers.map((a, j) => ({ ...a, isCorrect: j === aIdx })) }
          : q,
      ),
    );

  const onBulkSubmit = () => {
    setBulkError(null);
    bulkCreate.mutate(
      { questions: bulkQuestions },
      {
        onSuccess: (res) => {
          if (!res.status) {
            setBulkError(res.message ?? "Failed to create questions.");
            return;
          }
          router.push(`/admin/exams/${selectedExamId}/questions`);
        },
        onError: () => setBulkError("Something went wrong. Please try again."),
      },
    );
  };

  // ── shared submit dispatcher ───────────────────────────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkMode) {
      onBulkSubmit();
    } else {
      form.handleSubmit(onSingleSubmit)(e);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      {/* ── Top action bar ── */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant={bulkMode ? "default" : "outline"}
          className={cn(
            "rounded-none gap-2",
            bulkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200",
          )}
          onClick={() => setBulkMode((v) => !v)}
        >
          <LayoutGrid size={15} />
          Bulk Add Mode
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-none gap-2 bg-gray-200"
            onClick={() => router.back()}
          >
            <X size={15} />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={bulkMode ? bulkCreate.isPending : singlePending}
            className="rounded-none gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Save size={15} />
            {(bulkMode ? bulkCreate.isPending : singlePending) ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {bulkMode ? (
        /* ════════════════════════ BULK MODE ════════════════════════ */
        <>
          {/* Exam Info */}
          <div className="overflow-hidden border border-border shadow-sm">
            <div className="bg-blue-600 px-6 py-3">
              <h2 className="text-sm font-semibold tracking-wide text-white capitalize">
                Exam Info
              </h2>
            </div>
            <div className="bg-background p-6">
              <Field>
                <FieldLabel htmlFor="bulk-exam">Exam</FieldLabel>
                <Select
                  defaultValue={selectedExamId}
                  onValueChange={setSelectedExamId}
                >
                  <SelectTrigger id="bulk-exam" className="w-full rounded-none">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* Questions tabs */}
          <div className="overflow-hidden border border-border shadow-sm">
            <div className="bg-blue-600 px-6 py-3">
              <h2 className="text-sm font-semibold tracking-wide text-white capitalize">
                Questions
              </h2>
            </div>

            {/* Tab row */}
            <div className="flex items-center overflow-x-auto border-b border-border bg-white">
              {bulkQuestions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => switchTab(i)}
                  className={cn(
                    "group flex items-center gap-1 px-4 py-2.5 border-r border-border text-sm whitespace-nowrap shrink-0 transition-colors",
                    activeQIdx === i
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  Q{i + 1}
                  {bulkQuestions.length > 1 && (
                    <span
                      role="button"
                      onClick={(e) => removeBulkQuestion(i, e)}
                      className="invisible group-hover:visible text-red-400 hover:text-red-600 ml-0.5 leading-none"
                    >
                      <X size={12} />
                    </span>
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={addBulkQuestion}
                className="px-3 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Active question editor */}
            <div className="p-4">
              <div className="border-2 border-blue-400 p-4 flex flex-col gap-3">
                {/* Headline */}
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor={`bulk-q-${activeQIdx}`}>
                    Question Headline
                  </FieldLabel>
                  <textarea
                    id={`bulk-q-${activeQIdx}`}
                    rows={2}
                    value={activeQ.text}
                    onChange={(e) => updateBulkText(e.target.value)}
                    className="border-input w-full border bg-transparent px-3 py-2 text-sm outline-none resize-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]"
                  />
                </div>

                {/* Answers table */}
                <div className="border border-border overflow-hidden">
                  {/* Table header */}
                  <div className="flex items-center bg-gray-200 px-4 py-2 border-b border-border">
                    <span className="flex-1 pl-5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Body
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-none bg-green-600 hover:bg-green-700 text-white gap-1 text-xs"
                      onClick={() => setBulkShowPending(true)}
                    >
                      + Add Answer
                    </Button>
                  </div>

                  {/* Answer rows */}
                  {activeQ.answers.map((answer, aIdx) => (
                    <div
                      key={aIdx}
                      className="flex items-center px-4 py-3 border-b border-border gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => removeBulkAnswer(aIdx)}
                        className="text-red-500 hover:text-red-600 shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="flex-1 text-sm text-gray-800">{answer.text}</span>
                      <button
                        type="button"
                        onClick={() => markBulkCorrect(aIdx)}
                        className={cn(
                          "flex items-center gap-1 text-sm shrink-0 transition-colors",
                          answer.isCorrect
                            ? "text-green-500 font-medium"
                            : "border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        <Check size={14} />
                        {answer.isCorrect ? "Correct Answer" : "Mark Correct"}
                      </button>
                    </div>
                  ))}

                  {/* Pending answer input */}
                  {bulkShowPending && (
                    <div className="flex items-center px-4 py-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkShowPending(false);
                          setBulkPendingAnswer("");
                        }}
                        className="text-gray-500 hover:text-gray-700 shrink-0 border border-gray-300 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                      <Input
                        value={bulkPendingAnswer}
                        onChange={(e) => setBulkPendingAnswer(e.target.value)}
                        placeholder="Enter answer body"
                        className="flex-1 rounded-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addBulkAnswer();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-none bg-green-600 hover:bg-green-700 text-white gap-1 shrink-0 text-xs"
                        onClick={addBulkAnswer}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {bulkError && (
            <p role="alert" className="text-sm text-destructive">
              {bulkError}
            </p>
          )}
        </>
      ) : (
        /* ═══════════════════════ SINGLE MODE ═══════════════════════ */
        <>
          {/* Question Information */}
          <div className="overflow-hidden border border-border shadow-sm">
            <div className="bg-blue-600 px-6 py-3">
              <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
                Question Information
              </h2>
            </div>
            <div className="bg-background p-6 flex flex-col gap-5">
              <Field>
                <FieldLabel htmlFor="q-exam">Exam</FieldLabel>
                <Select
                  defaultValue={examId}
                  onValueChange={(val) => form.setValue("examId", val)}
                >
                  <SelectTrigger id="q-exam" className="w-full rounded-none">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="q-text">Question Headline</FieldLabel>
                <textarea
                  id="q-text"
                  rows={3}
                  className={cn(
                    "border-input placeholder:text-muted-foreground w-full border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none resize-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    form.formState.errors.text && "border-destructive ring-destructive/20",
                  )}
                  {...form.register("text", { required: "Question headline is required" })}
                  aria-invalid={!!form.formState.errors.text}
                />
                {form.formState.errors.text && (
                  <FieldError errors={[form.formState.errors.text]} />
                )}
              </Field>
            </div>
          </div>

          {/* Question Answers */}
          <div className="overflow-hidden border border-border shadow-sm">
            <div className="bg-blue-600 px-6 py-3">
              <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
                Question Answers
              </h2>
            </div>

            {/* Table header */}
            <div className="flex items-center bg-gray-200 px-4 py-2 border-b border-border">
              <span className="flex-1 pl-5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                Body
              </span>
              <Button
                type="button"
                size="sm"
                className="rounded-none bg-green-600 hover:bg-green-700 text-white gap-1 text-xs"
                onClick={() => setShowPending(true)}
              >
                + Add Answer
              </Button>
            </div>

            {/* Existing answer rows */}
            {fields.map((field, index) => {
              const isCorrect = watchedAnswers?.[index]?.isCorrect ?? false;
              return (
                <div
                  key={field.id}
                  className="flex items-center px-4 py-3 border-b border-border gap-3"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="flex-1 text-sm text-gray-800">{field.text}</span>
                  <button
                    type="button"
                    onClick={() => handleMarkCorrect(index)}
                    className={cn(
                      "flex items-center gap-1 text-sm shrink-0 transition-colors",
                      isCorrect
                        ? "text-green-500 font-medium"
                        : "border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    <Check size={14} />
                    {isCorrect ? "Correct Answer" : "Mark Correct"}
                  </button>
                </div>
              );
            })}

            {/* Pending new answer input row */}
            {showPending && (
              <div className="flex items-center px-4 py-3 border-b border-border gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPending(false);
                    setPendingAnswer("");
                  }}
                  className="text-gray-500 hover:text-gray-700 shrink-0 border border-gray-300 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
                <Input
                  value={pendingAnswer}
                  onChange={(e) => setPendingAnswer(e.target.value)}
                  placeholder="Enter answer body"
                  className="flex-1 rounded-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPendingAnswer();
                    }
                  }}
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  className="rounded-none bg-green-600 hover:bg-green-700 text-white gap-1 shrink-0 text-xs"
                  onClick={handleAddPendingAnswer}
                >
                  + Add
                </Button>
              </div>
            )}
          </div>

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
        </>
      )}
    </form>
  );
};

export default QuestionForm;
