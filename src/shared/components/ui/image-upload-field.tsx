"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { useUploadImage } from "@/features/upload/hooks/use-upload";
import Image from "next/image";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

function buildPreviewUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  const origin = new URL(process.env.NEXT_PUBLIC_API_URL!).origin;
  return `${origin}${url}`;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function extractFilename(url: string): string {
  return url.split("/").pop() ?? url;
}

const ImageUploadField = ({ value, onChange }: ImageUploadFieldProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending, error } = useUploadImage();
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  // Revoke object URL on unmount or when replaced
  useEffect(() => {
    return () => {
      if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const previewUrl = localPreview ?? buildPreviewUrl(value);
  const displayName = fileInfo?.name ?? (value ? extractFilename(value) : null);
  const displaySize = fileInfo?.size != null ? formatBytes(fileInfo.size) : null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview before upload finishes
    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    setLocalPreview(URL.createObjectURL(file));
    setFileInfo({ name: file.name, size: file.size });

    upload(file, {
      onSuccess: (res) => {
        if (res.status && res.payload?.url) {
          onChange(res.payload.url);
        }
      },
    });
    e.target.value = "";
  };

  const handleRemove = () => {
    if (localPreview?.startsWith("blob:")) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setFileInfo(null);
    onChange("");
  };

  const hasImage = !!previewUrl || isPending;

  if (!hasImage) {
    return (
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-25 w-full items-center justify-center gap-2 border border-dashed border-input bg-transparent text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
        >
          <Upload className="size-4" />
          Click to upload image
        </button>
        {error && (
          <p className="text-xs text-destructive">Upload failed. Please try again.</p>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3 border border-border px-3 py-2">
        <div className="size-12 shrink-0 overflow-hidden border border-border bg-muted">
          {previewUrl ? (
           
            <Image src={previewUrl} alt="Preview" className="h-full w-full object-cover" width={150} height={150} />
          ) : (
            <div className="h-full w-full animate-pulse bg-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {displayName ?? "Uploading…"}
          </p>
          {displaySize && (
            <p className="text-xs text-muted-foreground">
              {displaySize}
              {isPending && " · Uploading…"}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            title="Change image"
            disabled={isPending}
            onClick={() => fileRef.current?.click()}
            className="text-blue-500 transition-colors hover:text-blue-700 disabled:opacity-50"
          >
            <Download className="size-4" />
          </button>
          <button
            type="button"
            title="Remove image"
            disabled={isPending}
            onClick={handleRemove}
            className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive">Upload failed. Please try again.</p>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

export default ImageUploadField;
