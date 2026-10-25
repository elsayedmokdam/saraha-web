import { TextareaHTMLAttributes } from "react";

/** Props for AppTextarea component. */
export interface AppTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** @description Label for the textarea */
  label?: string;
  /** @description Class name for the textarea */
  className?: string;
}
