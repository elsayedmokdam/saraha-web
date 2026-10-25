"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { AppTextareaProps } from "./app_textarea.interface";

export default function AppTextarea({
  label,
  className = "",
  ...rest
}: AppTextareaProps) {
  return (
    <Field>
      {label && <FieldLabel>{label}</FieldLabel>}

      <textarea
        className={`w-full border border-input bg-card rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2! focus:ring-main-color! resize-none ${className}`}
        {...rest} // pass the rest of the props
      />
    </Field>
  );
}
