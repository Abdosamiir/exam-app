"use client";

import { useRef } from "react";
import { Button } from "./button";
import { useUploadImage } from "@/features/upload/hooks/use-upload";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

function buildPreviewUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const origin = new URL(process.env.NEXT_PUBLIC_API_URL!).origin;
  return `${origin}${url}`;
}

const ImageUploadField = ({ value, onChange }: ImageUploadFieldProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending, error } = useUploadImage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload(file, {
      onSuccess: (res) => {
        if (res.status && res.payload?.url) {
          onChange(res.payload.url);
        }
      },
    });
    e.target.value = "";
  };

  const previewUrl = buildPreviewUrl(value);

  return (
    <div className="flex flex-col gap-2">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="h-28 w-28 rounded object-cover border border-gray-200"
        />
      )}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => fileRef.current?.click()}
        >
          {isPending ? "Uploading…" : value ? "Change image" : "Upload image"}
        </Button>

        {value && (
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive">Upload failed. Please try again.</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

export default ImageUploadField;
