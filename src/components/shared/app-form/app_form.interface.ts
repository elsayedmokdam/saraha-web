import React from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";

export type FieldType = "input" | "textarea" | "select";

export interface FormField {
  name: string;
  type: FieldType;

  label?: string;
  placeholder?: string;

  /** Props passed to the component */
  props?: Record<string, any>;

  /** Conditional rendering: receives the current form values */
  showWhen?: (values: Record<string, any>) => boolean;

  hidden?: boolean;
}

export interface AppFormProps<T extends FieldValues = any> {
  /** Fields configuration */
  fields: FormField[];

  /** Components map (input, textarea, select) */
  components: Partial<Record<FieldType, React.ComponentType<any>>>;

  /** Submit handler */
  onSubmit: (data: T) => Promise<void> | void;

  /** Buttons */
  buttonText?: string;
  submitButton?: boolean;
  resetButton?: boolean;
  buttonClassName?: string;

  /** Validation schema */
  schema?: z.ZodType<any, any>;

  /** Default form values */
  defaultValues?: Partial<T>;

  /** Layout */
  layoutClassName?: string;
  formClassName?: string;

  /** Extra JSX rendered between the fields and the buttons */
  children?: React.ReactNode;
}
