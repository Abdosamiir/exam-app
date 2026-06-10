"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api/api.upload";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  });
}
