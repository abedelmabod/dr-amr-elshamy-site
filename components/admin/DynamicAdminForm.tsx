"use client";

import { FormEvent, useState } from "react";
import { MediaUploader } from "./MediaUploader";

export type DynamicField =
  | { name: string; label: string; type: "text"; value?: string; maxLength?: number }
  | { name: string; label: string; type: "textarea"; value?: string; maxLength?: number }
  | { name: string; label: string; type: "image"; value?: string; folder?: string }
  | { name: string; label: string; type: "checkbox"; value?: boolean };

type DynamicAdminFormProps = {
  fields: DynamicField[];
  endpoint: string;
  method?: "POST" | "PUT" | "PATCH";
  submitLabel?: string;
  onSaved?: (payload: unknown) => void;
};

export function DynamicAdminForm({
  fields,
  endpoint,
  method = "POST",
  submitLabel = "Save",
  onSaved,
}: DynamicAdminFormProps) {
  const initialValues = Object.fromEntries(fields.map((field) => [field.name, field.value ?? false]));
  const [values, setValues] = useState<Record<string, string | boolean>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(payload.error || "Could not save.");
    } else {
      setMessage("Saved successfully.");
      onSaved?.(payload);
    }

    setSaving(false);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      {fields.map((field) => (
        <label key={field.name}>
          <span>{field.label}</span>
          {field.type === "text" ? (
            <input
              maxLength={field.maxLength}
              value={String(values[field.name] || "")}
              onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
            />
          ) : null}
          {field.type === "textarea" ? (
            <textarea
              maxLength={field.maxLength}
              value={String(values[field.name] || "")}
              onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
            />
          ) : null}
          {field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(values[field.name])}
              onChange={(event) => setValues({ ...values, [field.name]: event.target.checked })}
            />
          ) : null}
          {field.type === "image" ? (
            <MediaUploader
              value={String(values[field.name] || "")}
              folder={field.folder}
              onUploaded={(url) => setValues({ ...values, [field.name]: url })}
            />
          ) : null}
        </label>
      ))}
      {message ? <p className="admin-form-message">{message}</p> : null}
      <button className="primary-button" type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
