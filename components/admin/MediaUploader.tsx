"use client";

import { useState } from "react";

type MediaUploaderProps = {
  value?: string;
  folder?: string;
  onUploaded: (url: string) => void;
};

export function MediaUploader({ value, folder = "general", onUploaded }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(result.error || "Upload failed.");
      setUploading(false);
      return;
    }

    onUploaded(result.url);
    setUploading(false);
  }

  return (
    <div className="admin-media-uploader">
      {value ? <img src={value} alt="" loading="lazy" /> : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      {uploading ? <small>Uploading...</small> : null}
      {error ? <small className="admin-error">{error}</small> : null}
    </div>
  );
}
