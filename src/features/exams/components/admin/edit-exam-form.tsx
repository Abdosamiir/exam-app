"use client";

import { IExam, IExamDetail } from "../../types/exam";
import ExamForm from "./exam-form";

interface EditExamFormProps {
  exam: IExam | IExamDetail;
}

const EditExamForm = ({ exam }: EditExamFormProps) => {
  return <ExamForm exam={exam} mode="edit" />;
};

export default EditExamForm;
