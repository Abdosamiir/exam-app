"use client";

import { IDiploma } from "../../types/diploma";
import DiplomaForm from "./diploma-form";

interface EditDiplomaFormProps {
  diploma: IDiploma;
}

const EditDiplomaForm = ({ diploma }: EditDiplomaFormProps) => {
  return <DiplomaForm diploma={diploma} mode="edit" />;
};

export default EditDiplomaForm;
