"use client";

import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api/api.upload";

export function useUploadImage() {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (file: File) => uploadImage(file, session!.accessToken),
  });
}
