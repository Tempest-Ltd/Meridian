"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ProductImageUpload({ images, onChange, max = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).slice(0, max - images.length);
    if (list.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is over 5MB`);
        continue;
      }

      const form = new FormData();
      form.append("file", file);
      form.append("folder", "meridian/products");

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Upload failed");
          continue;
        }
        uploaded.push(data.url);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
      toast.success(
        `${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`
      );
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  const remove = (url: string) => {
    onChange(images.filter((i) => i !== url));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          dragOver
            ? "border-[#c9a227] bg-[#c9a227]/5"
            : "border-border bg-surface-elevated hover:border-[#1b2e24]/30"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>
          </>
        ) : (
          <>
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-xs font-medium">
              Click to upload or drag and drop
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              PNG, JPG, WebP (max 5MB · up to {max} images)
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface"
            >
              <Image
                src={url}
                alt="Product image"
                fill
                sizes="100px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(url);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}